# 🎬 Práctica de Git Avanzado: Transición Navideña en Commit-Cinema
## Guión Oficial de Preguntas (11 a 20) — Participación Activa de los 3 Integrantes

### Contexto y Metodología de Trabajo en Equipo
La web del cine **Commit-Cinema** finaliza su campaña de Halloween y debe transformarse en la **Campaña de Navidad**.
Cada grupo estará formado por **3 integrantes (Desarrollador A, B y C)**.
> ⚠️ **Regla Fundamental de la Práctica**:  
> **En todas las preguntas deben intervenir los tres integrantes**. Aunque un desarrollador lidere una acción principal, los otros dos deben inspeccionar, verificar, sincronizar o validar el resultado en sus respectivas terminales para entender qué está ocurriendo en el repositorio común en todo momento.

---

### Pregunta 11: Fork del Proyecto, Clonación y Configuración Tripartita (Tiempo: 6 min)
1. **Desarrollador A**: Accede a `https://github.com/anlime10/Commit-Cinema`, realiza un **Fork** marcando la casilla de solo traer la rama `main` hacia la cuenta/organización del grupo y añade inmediatamente a **B** y **C** como colaboradores con permisos de escritura (*Settings -> Collaborators*).
2. **Desarrollador B y C**: Aceptan la invitación por correo/GitHub y confirman que tienen acceso al Fork.
3. **Desarrolladores A, B y C**: Cada uno clona en su máquina local **el Fork de su propio grupo** (no el del profesor).
4. **Desarrolladores A, B y C**: Cada alumno configura su identidad local (`user.name` y `user.email`).
5. **Desarrolladores A, B y C**: Todos añaden el repositorio original del profesor (`https://github.com/anlime10/Commit-Cinema.git`) como remoto secundario `upstream` y listan sus remotos para comprobar que disponen de `origin` y `upstream`.

> 💡 **Pistas (Comandos útiles)**: `git clone`, `git config user.name`, `git config user.email`, `git remote add <nombre (normalmente upstream)> <url>` (añade como `upstream` el repositorio padre del fork, para mantener actualizados los posibles cambios que se hagan en él), `git remote -v` (lista los remotos).

---

### Pregunta 12: Distribución y Creación de Ramas de Trabajo (Tiempo: 4 min)
El equipo divide el desarrollo en dos ramas principales:
1. **Desarrollador A**: Crea en su equipo local la rama `feature/cartelera-navidad` y la sube al repositorio remoto en GitHub vinculando el seguimiento upstream.
2. **Desarrollador B**: Actualiza las referencias remotas desde GitHub (`git fetch`), comprueba qué ramas existen en el servidor y cámbiate a la rama `feature/cartelera-navidad` para trabajar junto a A.
3. **Desarrollador C**: Desde `main`, crea su propia rama llamada `feature/decoracion-navidad`, cámbiate a ella y súbela al remoto en GitHub.
4. **Comprobación conjunta (A, B y C)**: Los tres ejecutan el comando para listar todas las ramas (locales y remotas) y confirman que ambos frentes de trabajo están visibles en sus terminales.

> 💡 **Pistas (Comandos útiles)**: `git checkout -b <rama>`, `git push -u origin <rama>` (`-u` es la abreviatura de `--set-upstream`, que asocia la rama local con la rama de `origin`), `git fetch`, `git checkout <rama>`, `git branch -a` (muestra todas las ramas y su estado).

---

### Pregunta 13: Concurrencia en la Misma Rama y Sincronización Tripartita (Tiempo: 7 min)
**A** y **B** van a trabajar de forma concurrente sobre la misma rama, mientras **C** observa e inspecciona el flujo de sincronización:

1. **Desarrollador A**: En `feature/cartelera-navidad`, modifica en `index.html` la portada y el título de la Película 1, utilizando la imagen de `assets/`:
   ```html
   <img src="assets/Solo en casa.jpeg" alt="Solo en Casa" loading="lazy">
   <h4 class="movie-title">Solo en Casa</h4>
   ```
   Añade el cambio, confírmalo con un mensaje descriptivo y súbelo a GitHub.
2. **Desarrollador B**: En tu máquina (sin haber descargado el cambio de A), modifica en `index.html` la portada y el título de la Película 2, utilizando la imagen de `assets/`:
   ```html
   <img src="assets/The Grinch.jpeg" alt="El Grinch" loading="lazy">
   <h4 class="movie-title">El Grinch</h4>
   ```
   Añade y confirma el cambio con un mensaje descriptivo. Intenta subir tu rama a GitHub y lee el error de rechazo.
3. **Desarrollador B**: Trae e integra los cambios remotos de A a tu rama local (observa la unión automática que realiza Git) y vuelve a subir la rama a GitHub.
4. **Desarrollador C y Desarrollador A**: Descargan y sincronizan en sus copias locales (`git fetch` / `git pull`) y verifican con el registro de commits (`git log --oneline -n 3`) que la rama `feature/cartelera-navidad` ya contiene las dos películas con sus portadas unificadas.

> 💡 **Pistas (Comandos útiles)**: `git add <archivo>`, `git commit -m "..."`, `git push origin <rama>`, `git pull origin <rama>`, `git log --oneline -n 3`.

---

### Pregunta 14: Cambio de Estilos, Inspección con `git diff` y Revisión Cruzada (Tiempo: 5 min)
1. **Desarrollador C**: Situado en tu rama `feature/decoracion-navidad`, abre `css/styles.css` y cambia las 3 variables de color principales en `:root` (líneas 11-13 aprox.):
   ```css
   --theme-color-primary: #c62828;      /* Rojo Papa Noel */
   --theme-color-secondary: #2e7d32;    /* Verde pino */
   --theme-color-accent: #fbc02d;       /* Dorado festivo */
   ```
2. **Desarrollador C**: Antes de confirmar, ejecuta la inspección línea a línea con `git diff` para mostrarle a sus compañeros qué líneas rojas se eliminan y qué líneas verdes se añaden. Confirma y sube la rama a GitHub.
3. **Desarrollador A y Desarrollador B**: Descargan las ramas remotas con `git fetch` y usan `git diff` comparando su estado contra la rama remota `origin/feature/decoracion-navidad` para validar los nuevos colores antes de fusionar.

> 💡 **Pistas (Comandos útiles)**: `git diff <archivo>`, `git add <archivo>`, `git commit -m "..."`, `git push origin <rama>`, `git fetch`, `git diff HEAD origin/feature/decoracion-navidad`.

---

### Pregunta 15: Pausa Rápida de Trabajo con `git stash` y Validación en Equipo (Tiempo: 5 min)
Los tres integrantes deben comprender el uso de la pila temporal (*stash*):
1. **Desarrollador A**: En su rama, realiza un cambio provisional en `index.html` en la etiqueta del badge:
   ```html
   <span class="tag-badge">ESTRENO EXCLUSIVO</span>
   ```
2. **Desarrollador A**: Sin hacer commit, comprueba el estado con `git status`. Guarda temporalmente los cambios en la pila (`git stash`) con un mensaje identificativo (`WIP...`) y verifica que el espacio de trabajo ha quedado limpio.
3. **Desarrollador B y C**: Indican a Desarrollador A qué comandos debe ejecutar para:
   * Listar el contenido guardado en la pila.
   * Restaurar y extraer los cambios de vuelta al fichero `index.html`.
4. **Desarrollador A**: Recupera sus cambios de la pila y, finalmente, descarta ese cambio provisional para dejar el archivo en su estado original.
5. **Todos (A, B y C)**: Ejecutan `git status` en sus respectivas ramas para verificar que todos tienen su directorio de trabajo 100% limpio.

> 💡 **Pistas (Comandos útiles)**: `git status`, `git stash push -m "..."`, `git stash list`, `git stash pop`, `git restore <archivo>`.

---

### Pregunta 16: El Conflicto de Fusión a Tres Bandas (Merge Conflict) (Tiempo: 10 min)
Vamos a provocar deliberadamente un conflicto en la misma línea del Hero Banner en `index.html` y los tres integrantes participarán en su resolución:

1. **Desarrollador A**: En `feature/cartelera-navidad`, cambia la línea del título en `index.html`:
   ```html
   <h2 class="hero-title">Festival de Cine Navideño Familiar</h2>
   ```
   Añade, confirma y sube el commit.
2. **Desarrollador C**: En `feature/decoracion-navidad`, cambia **esa misma línea** en `index.html` por:
   ```html
   <h2 class="hero-title">Gran Estreno de Películas Navideñas</h2>
   ```
   Añade, confirma y sube el commit.
3. **Desarrollador B (Líder de Integración en `main`)**:
   * Cámbiate a `main`, asegúrate de que esté al día y fusiona `feature/cartelera-navidad` (entrará limpio).
   * A continuación, intenta fusionar `feature/decoracion-navidad` en `main`. Git reportará el **CONFLICTO**.
4. **Inspección y Resolución Conjunta (A, B y C)**:
   * Los tres analizan las marcas de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).
   * B edita el archivo consensuando una línea unificada con A y C:
   ```html
   <h2 class="hero-title">Festival de Cine: Grandes Estrenos Navideños</h2>
   ```
   * B marca el archivo como resuelto, confirma el commit de merge y sube `main` a GitHub.
5. **Desarrollador A y C**: Se sitúan en `main` en sus terminales, hacen `git pull` y comprueban con `git log` que el conflicto ha sido resuelto y fusionado con éxito.

> 💡 **Pistas (Comandos útiles)**: `git checkout main`, `git pull`, `git merge <rama>`, `git status`, `git add <archivo>`, `git commit -m "..."`, `git push`.

---

### Pregunta 17: Creación Experimental y `git cherry-pick` Colaborativo (Tiempo: 6 min)
1. **Desarrollador B**: Crea una rama experimental llamada `experimento/promo` y cámbiate a ella.
2. **Desarrollador B**: En `js/main.js`, actualiza la línea del código de descuento:
   ```javascript
   activeDiscountCode: 'NAVIDAD2026',
   ```
   Añade el archivo y confirma con el mensaje: `"feat(promo): activar codigo promocional NAVIDAD2026"`. Sube la rama experimental a GitHub.
3. **Desarrollador A y C**: Descargan las referencias con `git fetch` y consultan el historial de la rama `origin/experimento/promo` para localizar (`git log`) y dictarle a Desarrollador A el identificador (hash corto) del commit de la promo.
4. **Desarrollador A**: Estando en la rama `main`, aplica **únicamente ese commit concreto** mediante `cherry-pick` (sin fusionar toda la rama experimental) y sube la rama `main` a GitHub.
5. **Desarrollador B y C**: Actualizan su rama `main` con `git pull` y comprueban en `js/main.js` que el código de descuento navideño ya está disponible en producción.

> 💡 **Pistas (Comandos útiles)**: `git checkout -b <rama>`, `git commit -m "..."`, `git push origin <rama>`, `git fetch`, `git log origin/<rama> --oneline -n 1`, `git checkout main`, `git cherry-pick <hash>`, `git pull`.

---

### Pregunta 18: Simulación de Error y `git revert` Supervisado (Tiempo: 5 min)
1. **Desarrollador C**: Situado en `main`, simula un error humano: borra la línea de información de contacto en el footer de `index.html`.
2. **Desarrollador C**: Añade, confirma y sube el error a GitHub con el mensaje: `"oops: borrado accidental del footer"`.
3. **Desarrollador A y B**: Hacen `git pull` en su rama `main`, abren la web o el código y detectan que falta el pie de página.
4. **Desarrollador A**: Localiza el hash del commit del error y ejecuta la orden para **revertir** dicho commit de forma no destructiva (generando un commit inverso). Sube la corrección a GitHub.
5. **Todos (A, B y C)**: Tras hacer `git pull`, ejecutan el historial de commits para comprobar cómo `git revert` solucionó la incidencia preservando intacta la historia del repositorio.

> 💡 **Pistas (Comandos útiles)**: `git log -n 2 --oneline`, `git revert HEAD --no-edit` (o `git revert <hash>`), `git push`, `git pull`.

---

### Pregunta 19: Etiquetado de Versión (`git tag`) y Limpieza Colegiada de Ramas (Tiempo: 6 min)
1. **Desarrollador A**: Estando en `main` actualizado, crea una **etiqueta anotada** de versión `v2.0.0-navidad` con el mensaje: `"Lanzamiento oficial de la web navidena"`.
2. **Desarrollador B**: Muestra los detalles de la etiqueta con el comando correspondiente para verificar autor, fecha y mensaje.
3. **Desarrollador C**: Procede a borrar las ramas secundarias locales que ya están integradas (`feature/cartelera-navidad`, `feature/decoracion-navidad`, `experimento/promo`) y borra las ramas remotas de GitHub.
4. **Desarrollador A y B**: Ejecutan el comando de borrado local de dichas ramas en sus máquinas y verifican con `git branch -a` que el repositorio ha quedado limpio y ordenado.

> 💡 **Pistas (Comandos útiles)**: `git tag -a <tag> -m "..."`, `git show <tag>`, `git branch -d <rama>`, `git push origin --delete <rama>`, `git branch -a`.

---

### Pregunta 20: Visualización Gráfica Conjunta y Entrega por Pull Request (Tiempo: 6 min)
1. **Desarrollador A**: Sube la rama `main` y todas las etiquetas a GitHub (`git push origin main --tags`).
2. **Desarrolladores A, B y C**: Cada uno ejecuta en su terminal el comando para generar el árbol gráfico completo de commits, fusiones y etiquetas (`git log` con formato gráfico, compacto y decorado) y comparan que los tres ven la misma historia sincronizada.
3. **Desarrollador B (en nombre de todo el equipo)**: Desde la web de vuestro Fork en GitHub, abre el **Pull Request** final hacia el repositorio original `anlime10/Commit-Cinema`.
   * **Título**: `[Grupo X] Transición Completa de Halloween a Navidad (Equipo A, B y C)`
   * **Descripción**: Pegar el fragmento de texto del árbol gráfico generado por la terminal y confirmar que los 3 integrantes han participado en todas las fases.

> 💡 **Pistas (Comandos útiles)**: `git push origin main --tags`, `git fetch --tags`, `git log --oneline --graph --all --decorate`.
