# Commit Cinema — Documentación técnica

Web estática para la actividad de Git de Evolución del Software. Cuatro equipos ("estudios") avanzan por 30 escenas (ejercicios) y compiten en una clasificación compartida en tiempo real.

## 1. Visión general

| Aspecto | Decisión |
|---|---|
| Tipo | SPA estática (HTML + CSS + JS con módulos ES, sin build ni framework) |
| Hosting | GitHub Pages (cualquier servidor estático vale) |
| Datos compartidos | Firebase Firestore (SDK 10.12.2 cargado desde `gstatic.com` bajo demanda) |
| Respaldo | Modo local (`localStorage` + `BroadcastChannel`) si no hay config de Firebase o falla la carga |
| Autenticación | Ninguna. Cada equipo se identifica con un código; es control de acceso "de cortesía" |
| Navegación | Router por hash (`#/`, `#/ex/N`, `#/ranking`) |

### Estructura de archivos

```
commit_cinema/
├── index.html            Shell: cabecera, banner, <main id="app">, carga js/app.js
├── css/style.css         Tema cine (variables CSS en :root, componentes)
├── data/exercises.js     Contenido: equipos, niveles, 30 ejercicios
├── js/
│   ├── app.js            Estado, router, vistas, puntuación
│   ├── store.js          Capa de datos (Firebase / local), misma interfaz
│   └── config.js         FIREBASE_CONFIG y ADMIN_CODE
├── README.md             Guía rápida
└── DOCUMENTACION.md      Este documento
```

### Flujo de arranque

```
index.html → js/app.js
   └─ createStore()            (store.js) elige Firebase o local
   └─ store.subscribe(cb)      cb recibe SIEMPRE el mapa completo { teamId: teamDoc }
         ├─ data = all
         └─ render() o syncExercise()
   └─ hashchange → render()
```

## 2. Arquitectura de datos

### 2.1 Contenido estático (`data/exercises.js`)

**`TEAMS`**: `[{ id, name, color, code }]`. `id` es la clave del documento en Firestore (`a`, `b`, `c`, `d`); `code` es el código de acceso (ALFA, BETA, GAMMA, DELTA).

**`LEVELS`**: etiquetas de los tres actos (`basic` 1-10, `mid` 11-20, `final` 21-30).

**`EXERCISES`**: lista de 30 objetos. Campos comunes: `id` (1-30), `level`, `type`, `title`, `body`. El resto depende del tipo:

| `type` | Ejercicios | Campos extra | Puntúa |
|---|---|---|---|
| `task` | 1-20 | `hint` (opcional) | No (solo checklist) |
| `quiz` | 21-25 | `options[]`, `answer` (índice correcto), `points` | Sí |
| `order` | 26-30 | `steps[]` (en orden correcto), `points` | Sí |

`body` e `hint` admiten `` `código` `` (se convierte en `<code>`) y párrafos separados por línea en blanco.

### 2.2 Datos dinámicos (Firestore)

Colección `teams`, un documento por equipo (`teams/a`, `teams/b`, …), creado al primer movimiento del equipo:

```jsonc
{
  "done": [1, 2, 5],                 // ids de ejercicios task marcados como hechos
  "answers": {                       // solo para quiz y order, clave = id del ejercicio
    "21": { "attempts": 2, "correct": true,  "points": 8 },
    "26": { "attempts": 1, "correct": false, "points": 0 }
  },
  "updatedAt": 1761580000000         // ms desde epoch; sirve de desempate
}
```

Puntos totales de un equipo = suma de `answers[*].points`. No se guarda ningún total: se calcula al leer (`scoreOf`).

En modo local la estructura es idéntica, guardada en `localStorage` bajo la clave `commit-cinema-state-v1` como `{ teamId: teamDoc }`. La identidad del equipo en ese navegador se guarda aparte en `localStorage["cc-team"]`.

### 2.3 Reglas de Firestore

```
match /teams/{id} { allow read, write: if true; }
```

Abiertas por diseño (actividad de un día). Cualquiera con la URL podría modificar datos; cerrar o borrar el proyecto tras la actividad.

## 3. Capa de datos (`js/store.js`)

`createStore()` devuelve un objeto con la misma interfaz en ambos modos:

| Método | Descripción |
|---|---|
| `mode` | `"firebase"` o `"local"` |
| `subscribe(cb)` | Llama a `cb(allTeams)` ahora y en cada cambio. Devuelve función para cancelar |
| `update(teamId, fn)` | Aplica `fn(teamDoc)` sobre el documento del equipo y lo guarda con `updatedAt = Date.now()` |
| `reset()` | Borra todos los equipos |

**Firebase** (`makeFirebase`): importa `firebase-app.js` y `firebase-firestore.js` dinámicamente. `subscribe` usa `onSnapshot` sobre la colección. `update` usa `runTransaction` (leer–modificar–escribir atómico, evita pisarse si dos miembros del mismo equipo escriben a la vez). `reset` borra cada documento con `deleteDoc`.

**Local** (`makeLocal`): lee/escribe `localStorage`; notifica a otras pestañas mediante `BroadcastChannel("commit-cinema")` y el evento `storage`.

**Selección**: Firebase solo si `FIREBASE_CONFIG.projectId` existe; si el import o la inicialización fallan, se cae a modo local y se muestra el banner amarillo.

## 4. Lógica de aplicación (`js/app.js`)

### Estado
- `store`: instancia de la capa de datos.
- `data`: último snapshot completo `{ teamId: teamDoc }`.
- `teamId`: equipo de esta sesión (de `localStorage["cc-team"]`).
- `orderState`: `{ exId, items }` con el orden actual del ejercicio de ordenar abierto; vive en memoria para no perderse con los re-renderizados.

### Funciones auxiliares
| Función | Qué hace |
|---|---|
| `esc(s)` | Escapa HTML (evita inyección al pintar texto de datos) |
| `md(s)` | `esc` + `` `código` `` → `<code>` + párrafos |
| `teamData(id)` | Documento del equipo o uno vacío si aún no existe |
| `scoreOf(id)` | Suma de puntos de `answers` |
| `doneTasks(id)` | Nº de ejercicios `task` hechos |
| `solved(id, ex)` | ¿Ejercicio quiz/order resuelto correctamente? |
| `pointsFor(base, attempts)` | `base × max(0.25, 1 − 0.25 × (attempts − 1))`, redondeado |
| `shuffled(arr, seed)` | Barajado determinista por id de ejercicio (todos los equipos ven el mismo desorden; nunca devuelve el orden correcto) |
| `safeGet/safeSet` | Acceso a `localStorage` con `try/catch` |

### Router (`render`)
Lee `location.hash` y decide la vista:

| Hash | Vista | Condición |
|---|---|---|
| `#/ranking` | `viewRanking` | Siempre accesible |
| cualquier otra sin equipo | `viewLogin` | `teamId` nulo |
| `#/ex/N` | `viewExercise(N)` | Con equipo |
| resto | `viewMap` | Con equipo |

También pinta el chip del equipo y el botón "salir", y marca la pestaña activa del menú.

### Vistas
- **`viewLogin`**: tarjetas de los 4 equipos → al elegir uno aparece el campo de código; si coincide (sin distinguir mayúsculas) guarda `cc-team` y navega al mapa.
- **`viewMap`**: cabecera con progreso (`hechas / 30`) y puntos; tres actos con claquetas por ejercicio, marcadas como completadas según su tipo.
- **`viewExercise`**: renderiza según `type`:
  - `task`: pista desplegable + casilla "Hecho" (añade/quita el id en `done`).
  - `quiz`: botones de opción; el clic llama a `submit(ex, esCorrecta)`.
  - `order`: lista arrastrable (HTML5 drag & drop) con botones ↑/↓ como alternativa táctil/accesible; `renderOrder` repinta la lista; "Comprobar" compara `items` con `steps`.
- **`viewRanking`**: tabla ordenada por puntos desc → ejercicios git hechos desc → `updatedAt` asc (quien llegó antes). Resalta el equipo propio. Incluye bloque Admin (reinicio con `ADMIN_CODE` + `confirm`).

### Puntuación (`submit`)
1. `store.update` en transacción; si el ejercicio ya está `correct`, no hace nada (no se puntúa dos veces).
2. Incrementa `attempts`. Si acierta: `correct = true`, `points = pointsFor(base, attempts)`.
3. Si falla, muestra el mensaje de error tras el re-render que provoca la suscripción.

Ejemplo con 10 puntos base: 1.º intento 10, 2.º 8 (75 %), 3.º 5 (50 %), 4.º o más 3 (25 %, mínimo).

### Actualización en vivo (`store.subscribe`)
Cada cambio (propio o ajeno) rehace `data` y:
- fuera de un ejercicio → `render()` completo;
- dentro de un ejercicio → `syncExercise()`: no se repinta mientras el equipo está ordenando comandos (para no deshacer el arrastre), salvo que el ejercicio ya esté resuelto; los quiz/task sí se repintan.

## 5. Interfaz y estilos (`css/style.css`)

- Tema oscuro fijo con variables en `:root` (`--bg`, `--panel`, `--gold`, `--ok`, …) y tipografías del sistema (Impact para títulos).
- Componentes: `.top` (cabecera), `.hero` + `.bar` (progreso), `.reel` + `.clap` (claquetas con borde rayado), `.opt` (opciones de quiz), `.order` (lista arrastrable), `.rank` (tabla).
- Color de cada equipo inyectado como variable `--c` en línea.
- Responsive: rejillas con `auto-fill/auto-fit`; en móvil (<600 px) la tabla oculta la columna de "Git real".

Para el rediseño visual bastará con tocar `css/style.css` (variables y componentes) y, si cambia el marcado, las plantillas HTML de las funciones `view*` en `app.js`.

## 6. Configuración y despliegue

- **`js/config.js`**: solo `ADMIN_CODE` (por defecto `CLAQUETA`).
- **`js/firebase-config.js`** (no está en git): exporta `FIREBASE_CONFIG`. `store.js` lo carga con `import()` dinámico y, si no existe, usa modo local. En local se crea a mano desde `firebase-config.example.js`; en producción lo genera `.github/workflows/pages.yml` desde el secret `FIREBASE_CONFIG_JSON`. La `apiKey` sigue siendo visible en el JS desplegado (es inherente a Firebase web): se protege restringiéndola por dominio en Google Cloud y con las reglas de Firestore.
- **Local**: `npx serve . -l 3000` (los módulos ES no funcionan abriendo el HTML con `file://`).
- **Producción**: repo público de GitHub; Pages con origen **GitHub Actions**. Cada push a `main` ejecuta el workflow, que inyecta la config de Firebase y publica el sitio.
- **Contenido**: editar solo `data/exercises.js`.

## 7. Limitaciones conocidas

- **Respuestas visibles**: las soluciones de quiz y orden están en el código fuente del navegador.
- **Sin autenticación real**: los códigos de equipo también son visibles en el código; cualquiera puede escribir en Firestore.
- **Puntuación en cliente**: un usuario técnico podría falsear sus puntos.
- **Ejercicios 1-20 sin validación**: la web solo registra la casilla "Hecho"; la corrección depende de la rúbrica y las soluciones.
- **Un único documento por equipo**: dos miembros del mismo equipo comparten progreso; las transacciones evitan pérdidas de escritura simultánea.
- **Escalabilidad**: pensada para 4 equipos; no hay paginación ni límites.

## 8. Ideas de ampliación

Temporizador global de 2,5 h, validación de repos vía API de GitHub, penalización por tiempo, reglas de Firestore con validación de esquema, mover la corrección a una Cloud Function, panel de admin dedicado.
