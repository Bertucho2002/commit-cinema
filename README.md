# 🎬 Commit Cinema

Web interactiva para practicar **Git** de forma amena, creada para la asignatura *Evolución del Software*. La actividad tiene temática de videoclub ochentero: cuatro equipos (estudios) avanzan por 30 escenas, que son los ejercicios, y compiten en una clasificación en tiempo real.

**Web publicada:** <https://bertucho2002.github.io/commit-cinema/>

## De qué va

| Escenas | Contenido | Cómo se resuelve | Puntúa |
|---|---|---|---|
| 1-10 | Git básico: `init`, `commit`, ramas, `merge`, `rebase`, `reset`, `revert`, `cherry-pick`… | En la terminal, con git real | Solo progreso |
| 11-20 | Git intermedio-avanzado: fork, colaboración en GitHub, conflictos, `stash`, tags, Pull Requests | En equipo (3 personas), con git real y GitHub | Solo progreso |
| 21-25 | Cuestionarios de opción múltiple | En la web | Sí |
| 26-30 | Ordenar comandos arrastrando | En la web | Sí |

Los ejercicios 1-20 se marcan como «Hecho» con una casilla. Los 21-30 puntúan, y cada fallo previo resta un 25 % de los puntos, con un mínimo del 25 %.

## Funciones

- 4 equipos, cada uno con su código de acceso.
- Mapa de escenas en forma de entradas de cine, con el progreso de cada equipo.
- Clasificación compartida y en vivo, con desempate por ejercicios completados y por quién llegó antes.
- Enunciados escritos en Markdown, sin tocar código.
- Panel de administración para reiniciar la partida.

## Tecnología

HTML, CSS y JavaScript sin framework ni build (módulos ES). Los datos compartidos van en **Firebase Firestore** y el despliegue en **GitHub Pages** mediante GitHub Actions. Sin configuración de Firebase funciona en modo local, aunque el ranking solo se comparte entre pestañas del mismo navegador.

## Estructura

```
index.html              Página única
css/style.css           Estilos
js/app.js               Vistas, navegación y puntuación
js/store.js             Datos compartidos (Firebase o local)
js/config.js            Código de administración
data/exercises.js       Equipos, niveles y ejercicios 21-30
data/guion-1-10.md      Enunciados de las escenas 1-10
data/guion-11-20.md     Enunciados de las escenas 11-20
.github/workflows/      Despliegue en GitHub Pages
```

## Ejecutar en local

Los módulos ES necesitan un servidor HTTP:

```bash
npx serve . -l 3000
```

Después abre <http://localhost:3000>. Para usar Firebase en local, copia `js/firebase-config.example.js` a `js/firebase-config.js` y rellénalo con la configuración de tu proyecto (ese archivo no se sube a git).

## Editar el contenido

- **Escenas 1-20:** edita los `.md` de `data/`. Cada una empieza con `### N. Título` o `### Pregunta N: Título (Tiempo: X min)`.
- **Escenas 21-30 y equipos:** edita `data/exercises.js`.
- Al publicar cambios, sube el número `?v=` de `index.html`, `js/app.js` y `data/exercises.js` para evitar la caché de GitHub Pages.

## Despliegue

Cada push a `main` lo publica el workflow de GitHub Actions. Requiere que en *Settings → Pages* el origen sea **GitHub Actions**, y el secret `FIREBASE_CONFIG_JSON` (JSON de la configuración de Firebase), que el workflow convierte en `js/firebase-config.js` al desplegar. La clave de Firebase no está en el repositorio, aunque sí es visible en el JavaScript publicado: se protege con restricciones por dominio y con las reglas de Firestore.

## Más información

Arquitectura, modelo de datos y funciones internas: [DOCUMENTACION.md](DOCUMENTACION.md).

## Autores

Alberto López Rodríguez · Antonio Lima Melero · Pablo Troncoso Zambrano
