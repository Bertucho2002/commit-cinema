# Commit_Cinema: Git en una noche de cine de terror

Diez ejercicios prácticos de Git con temática de cine de terror, pensados para completarse en **1 hora como máximo**. Eres el programador de la cartelera del cine **Commit_Cinema** en Halloween y trabajas sobre un archivo `peliculas.json` que guarda las películas.

**Cómo funciona**
- Es **una sola historia continua**: completa los ejercicios **en orden** y cada paso **de uno en uno**. Lo que haces en un ejercicio es lo que te encuentras en los siguientes: decisiones, correcciones y cambios de opinión salen del trabajo que ya está en el historial.
- Todo se hace en un repositorio **local**, sin GitHub ni repositorios remotos.
- No hay preguntas: cada paso es una acción y lleva el comando que debes ejecutar.

**Entorno: Windows y Visual Studio Code**
- Trabajas con **Visual Studio Code** y su **terminal integrada** (`Terminal > Nuevo terminal`, o `` Ctrl+` ``). Sirve PowerShell, Símbolo del sistema o Git Bash: todos los comandos de esta guía funcionan igual en los tres.
- Necesitas **Git 2.28 o superior**. Compruébalo con `git --version`.
- Necesitas el comando `code` en el PATH (el instalador de VS Code lo añade por defecto). Compruébalo con `code --version`. Lo usarás en los ejercicios 7 y 8, donde Git necesita abrir un editor.
- Ejecuta los comandos **en la terminal**, no con los botones del panel *Control de código fuente* de VS Code. Ignora los botones *Publicar rama* y *Sincronizar*: no hay repositorio remoto.

**Convenciones**
- **Guardar un cambio** significa siempre dos comandos: `git add peliculas.json` (prepararlo en el *staging area*) y `git commit -m "mensaje"` (`-m` escribe el mensaje del commit en la propia línea de comandos, para que Git no abra un editor). Cada paso te da el mensaje exacto.
- Prefijos de los mensajes de commit: `feat:` para añadir una película, `fix:` para corregir un dato, `style:` para formato, `wip:` para trabajo a medias y `merge:` para integrar ramas.
- En el JSON, escribe los datos sin tildes (`Terror psicologico`, `anio`, `Diabolicos`).
- Cada película es un objeto con tres campos: `titulo` (texto), `genero` (texto) y `anio` (número, sin comillas). El ejercicio 1 muestra el formato completo.
- Cuando se diga "al principio" o "al final" del array, añade la película exactamente ahí, dentro de la lista `peliculas`.
- Para comprobar que el JSON es válido, mira VS Code: subraya en rojo los errores (una coma que falta o sobra, una llave sin cerrar) y los lista en el panel *Problemas* (`Ctrl+Shift+M`). **Guarda el archivo (`Ctrl+S`) y comprueba que no hay errores antes de cada commit.**
- Si un comando muestra la salida en un paginador (aparece `:` o `(END)` abajo del todo), pulsa `q` para salir.
- En Windows, Git puede mostrar avisos como `LF will be replaced by CRLF`. Son normales y no afectan a los ejercicios.

**Las películas de la cartelera**
Solo trabajarás con cinco películas: *Pesadilla en Main Street*, *Evil HEAD: Noche de Muertos en la Terminal*, *The Texas Chainsaw Merge*, *El Resplandor* (que acabará siendo *El Re-base-plandor*) y *Pull-tergeist: Juegos Diabolicos*.

---

### 1. Crear el repositorio desde cero (`git init`, `git status`, `git add`, `git commit`)

1. Crea el directorio y entra en él: `mkdir Commit_Cinema` y `cd Commit_Cinema`.
2. Inicializa Git con `main` como rama principal: `git init -b main`. `git init` convierte la carpeta en un repositorio.
3. Configura tu identidad: `git config user.name "Tu Nombre"` y `git config user.email "tu@correo.com"`. Son el nombre y el correo que Git guardará en tus commits; al no usar `--global`, solo valen para este repositorio.
4. Abre la carpeta en VS Code con `code .` y crea en ella el archivo `peliculas.json` (`Archivo > Nuevo archivo`, o el icono de nuevo archivo del explorador) con esta plantilla:

```json
{
  "_formato": {
    "titulo": "texto",
    "genero": "texto",
    "anio": "numero de cuatro cifras"
  },
  "peliculas": []
}
```

   El bloque `_formato` es solo una referencia: indica cómo se guarda cada película. No lo borres ni lo modifiques. Las películas se irán añadiendo dentro de la lista `peliculas`, cada una como un objeto con esos tres campos. Por ejemplo:

```json
    {
      "titulo": "Pesadilla en Main Street",
      "genero": "Slasher",
      "anio": 1984
    }
```

   Cuando haya más de una, los objetos van separados por comas, y el último no lleva coma detrás.

5. Comprueba el estado del repositorio: `git status`, que muestra qué archivos son nuevos, están modificados o están preparados para el commit. El archivo aparece como no rastreado.
6. Prepara el archivo: `git add peliculas.json`.
7. Haz el primer commit: `git commit -m "feat: agregar plantilla base de peliculas.json"`.
8. Mira el historial: `git log --oneline`. `git log` lista los commits y `--oneline` resume cada uno en una sola línea (hash corto y mensaje).

> 💡 **Pistas (Comandos útiles)**: `mkdir`, `cd`, `git init -b main`, `git config user.name`, `git status`, `git add`, `git commit -m`, `git log --oneline`.

---

### 2. Primera película y rama de trabajo (`git switch -c`, `git branch`)

1. En `main`, añade *"Pesadilla en Main Street"* (género `Slasher`, año `1984`). Guárdalo con `git add peliculas.json` y `git commit -m "feat: agregar Pesadilla en Main Street"`.
2. Crea y cámbiate a una rama nueva para el terror más sangriento: `git switch -c feature/splatter`. `git switch` cambia de rama y `-c` la crea antes de cambiarte.
3. Comprueba en qué rama estás: `git branch`, que lista las ramas del repositorio. El asterisco debe estar en `feature/splatter`.
4. Añade, **al principio** del array, *"Evil HEAD: Noche de Muertos en la Terminal"* (género `Slasher`, año `1981`). Guárdalo con `git add peliculas.json` y `git commit -m "feat: agregar Evil HEAD"`.

> 💡 **Pistas (Comandos útiles)**: `git add`, `git commit -m`, `git switch -c <rama>`, `git branch` (el asterisco marca la rama actual).

---

### 3. Integrar ramas con `git merge`

Mientras tanto, `main` sigue su curso: llega otra película a la cartelera.

1. Vuelve a la rama principal: `git switch main`.
2. Añade, **al final** del array, *"The Texas Chainsaw Merge"* (género `Slasher`, año `1974`). Guárdalo con `git add peliculas.json` y `git commit -m "feat: agregar The Texas Chainsaw Merge"`.
3. Mira el grafo: `git log --oneline --graph --all`. `--graph` dibuja las ramas como un grafo y `--all` incluye todas las ramas, no solo la actual. `main` y `feature/splatter` han avanzado por separado.
4. Integra la rama con un commit de integración y sin abrir el editor: `git merge feature/splatter -m "merge: integrar feature/splatter"`. `git merge <rama>` trae a la rama actual los cambios de otra, y `-m` fija el mensaje del commit de integración. Git combina los cambios solo, porque cada rama tocó una parte distinta del archivo.
5. Mira de nuevo el grafo: `git log --oneline --graph --all`. Aparece un commit de merge que une las dos ramas.
6. Borra la rama ya integrada: `git branch -d feature/splatter`. `-d` borra una rama solo si sus cambios ya están integrados; si no, Git se niega.
7. Abre `peliculas.json` y comprueba que tiene las tres películas.

> 💡 **Pistas (Comandos útiles)**: `git switch main`, `git log --oneline --graph --all`, `git merge <rama> -m "..."`, `git branch -d <rama>`.

---

### 4. Historial lineal con `git rebase`

Repasando la cartelera, te das cuenta de que *Evil HEAD* no es un slasher (el género que le diste en el ejercicio 2), sino **splatter**. Lo corriges en una rama aparte mientras `main` sigue avanzando.

1. Crea y cámbiate a una rama nueva: `git switch -c feature/correcciones`.
2. Cambia el género de Evil HEAD de `Slasher` a `Splatter`. Guárdalo con `git add peliculas.json` y `git commit -m "fix: concretar genero de Evil HEAD"`.
3. Vuelve a la rama principal: `git switch main`.
4. Añade, **al principio** del array, *"El Resplandor"* (género `Terror psicologico`, año `1980`). Guárdalo con `git add peliculas.json` y `git commit -m "feat: agregar El Resplandor"`.
5. Mira el grafo: `git log --oneline --graph --all`. Las dos ramas han divergido.
6. Cámbiate a la rama de correcciones: `git switch feature/correcciones`.
7. Muévela encima de `main`: `git rebase main`. `git rebase <rama>` recoloca los commits de la rama actual encima de otra, volviendo a crearlos.
8. Vuelve a la rama principal: `git switch main`.
9. Integra la rama: `git merge feature/correcciones`. Esta vez no hay commit de merge (*fast-forward*: Git solo adelanta la rama hasta el último commit, porque no hay cambios divergentes).
10. Borra la rama: `git branch -d feature/correcciones`.
11. Mira el grafo: `git log --oneline --graph`. Los dos últimos commits de `main` forman ahora una línea recta.

> 💡 **Pistas (Comandos útiles)**: `git switch -c`, `git rebase main`, `git merge <rama>`, `git branch -d`, `git log --oneline --graph`.

---

### 5. HEAD y referencias relativas (`git switch --detach`, `HEAD~`, `git branch`)

`HEAD` es el commit en el que estás ahora mismo, `HEAD~1` es el commit anterior a él y `HEAD~2` el anterior a ese.

1. Mira el historial y localiza `HEAD`: `git log --oneline`.
2. Viaja dos commits atrás sin crear ninguna rama: `git switch --detach HEAD~2`.
3. Comprueba el estado: `git status`. Aparece `HEAD detached at ...`.
4. Vuelve a la rama principal: `git switch main`.
5. Deja un marcador en ese punto del historial creando una rama llamada `sotano` que apunte a `HEAD~2`: `git branch sotano HEAD~2`.
6. Lista las ramas con `git branch` y comprueba con `git log --oneline sotano -1` (`sotano` indica de qué rama mostrar el historial y `-1` limita la salida a 1 commit; con otro número N, muestra N commits) que `sotano` apunta al commit `merge: integrar feature/splatter`.

> 💡 **Pistas (Comandos útiles)**: `git log --oneline`, `git switch --detach HEAD~2`, `git status`, `git switch main`, `git branch sotano HEAD~2`.

---

### 6. Deshacer: `git revert` y `git reset`

**Parte A: retirar una película dejando constancia**

El distribuidor de *The Texas Chainsaw Merge* (el commit del ejercicio 3) comunica que **retira la película**. Ese commit ya forma parte del historial, así que no lo borras: lo reviertes y queda constancia.

1. Mira el historial: `git log --oneline`. Copia el hash (los caracteres a la izquierda de cada commit, su identificador) del commit `feat: agregar The Texas Chainsaw Merge`.
2. Revierte ese commit sin abrir el editor: `git revert <HASH> --no-edit` (sustituye `<HASH>` por el hash que copiaste). `git revert` crea un commit nuevo que deshace los cambios de otro sin borrar nada del historial, y `--no-edit` acepta el mensaje que propone Git.
3. Mira el historial: `git log --oneline -4`. Arriba aparece un commit nuevo `Revert "feat: agregar The Texas Chainsaw Merge"`.
4. Abre `peliculas.json` y comprueba que Texas Chainsaw ya no está.

**Parte B: cambio de opinión antes de comunicarlo**

Minutos después, el distribuidor aclara que fue un malentendido y la película **sigue en cartelera**. Como el revert es el último commit y todavía no lo has comunicado a nadie, lo descartas por completo.

5. Retrocede un commit descartando también los cambios del archivo: `git reset --hard HEAD~1`. `git reset` mueve la rama actual a otro commit y `--hard` además deja el archivo tal como estaba en ese commit.
6. Mira el historial: `git log --oneline -3`. El commit `Revert` ha desaparecido.
7. Abre `peliculas.json` y comprueba que Texas Chainsaw ha vuelto.

> 💡 **Pistas (Comandos útiles)**: `git log --oneline`, `git revert <hash> --no-edit`, `git reset --hard HEAD~1`.

---

### 7. Reescribir el pasado con rebase interactivo (`git rebase -i`)

El título *"El Resplandor"*, que añadiste en el ejercicio 4, debe convertirse en el juego de palabras *"El Re-base-plandor"*.

1. Mira el historial con `git log --oneline -2` y comprueba que los dos últimos commits son `fix: concretar genero de Evil HEAD` y, justo debajo, `feat: agregar El Resplandor`.
2. Abre el rebase interactivo sobre esos 2 commits: `git -c core.editor="code --wait" rebase -i HEAD~2`. `-i` (interactivo) te deja decidir qué hacer con cada uno de los últimos commits. Git necesita un editor para mostrarte la lista de commits y, por defecto, abriría `vim` dentro de la propia terminal. Con `-c core.editor="code --wait"` le indicas que use VS Code **solo para este comando**: `--wait` hace que Git espere a que cierres la pestaña antes de continuar. Es el único comando de este ejercicio que necesita editor. Si ves el commit `merge: integrar feature/splatter` en la lista, has contado de más: sal con `git rebase --abort` (cancela el rebase y deja todo como estaba) y repite el paso.
3. Se abre una pestaña de VS Code con la lista de commits. Cambia `pick` por `edit` en la línea de El Resplandor (`pick` conserva el commit tal cual; `edit` detiene el rebase en él para que puedas modificarlo). La lista va del commit más antiguo al más reciente, al revés que `git log`. Guarda (`Ctrl+S`) y **cierra la pestaña** (`Ctrl+W`): Git no continúa hasta que la cierras. Entonces se detendrá en ese commit.
4. Cambia el título en `peliculas.json` a `"El Re-base-plandor"`.
5. Prepara el archivo con `git add peliculas.json` y actualiza el commit sin cambiar su mensaje con `git commit --amend --no-edit`. `--amend` modifica el último commit en lugar de crear uno nuevo, y `--no-edit` conserva su mensaje.
6. Continúa el rebase: `git rebase --continue`, que le dice a Git que siga con el resto de commits una vez hecho el cambio.
7. Comprueba que el cambio quedó en el commit correcto: `git log --oneline -S "Re-base-plandor"` (con un espacio después de `-S`). `-S "texto"` muestra solo los commits que añadieron o quitaron ese texto. Debe aparecer `feat: agregar El Resplandor`.

> 💡 **Pistas (Comandos útiles)**: `git log --oneline -2`, `git rebase -i HEAD~2`, `edit`, `git commit --amend --no-edit`, `git rebase --continue` (y `git rebase --abort` si te pierdes).

---

### 8. Unificar commits desordenados: *squash* (`git rebase -i`)

Empiezas a preparar la siguiente película, *Pull-tergeist*, en una rama aparte y con prisas: haces tres commits seguidos para ir guardando.

**Parte A: tres commits descuidados**

1. Crea y cámbiate a una rama nueva: `git switch -c rama-paranormal`.
2. Añade, **al principio** del array, *"Pull-tergeist: Juegos Diabolicos"* con género `terror sobrenatural` (en minúscula) y año `1981`. Guárdalo con `git add peliculas.json` y `git commit -m "feat: inicio Pull-tergeist"`.
3. Cambia el año a `1982`. Guárdalo con `git add peliculas.json` y `git commit -m "fix: corregir anio Pull-tergeist"`.
4. Cambia el género a `Terror sobrenatural` (con mayúscula). Guárdalo con `git add peliculas.json` y `git commit -m "style: capitalizar genero Pull-tergeist"`.

**Parte B: unirlos en uno**

5. Abre el rebase interactivo sobre los 3 últimos commits, indicando de nuevo VS Code como editor solo para este comando: `git -c core.editor="code --wait" rebase -i HEAD~3`. Este mismo comando abrirá las dos pestañas de los pasos siguientes (la lista de commits y el mensaje).
6. En la pestaña de VS Code que se abre, deja el primer commit como `pick` y cambia los otros dos a `squash` (o `s`), que fusiona cada commit con el anterior. Guarda (`Ctrl+S`) y cierra la pestaña (`Ctrl+W`).
7. Se abre otra pestaña con los tres mensajes juntos. Borra los tres mensajes (las líneas que empiezan por `#` son comentarios y Git las ignora), escribe un único mensaje, `feat: agregar ficha completa de Pull-tergeist`, guarda (`Ctrl+S`) y cierra la pestaña (`Ctrl+W`).
8. Comprueba que ahora hay un solo commit en lugar de tres: `git log --oneline -3`.

> 💡 **Pistas (Comandos útiles)**: `git switch -c`, `git rebase -i HEAD~3`, `pick` y `squash`, `git log --oneline -3`.

---

### 9. Rescatar un commit de otra rama (`git cherry-pick`)

Sigues en `rama-paranormal`. La ficha de Pull-tergeist ya está terminada, pero antes de dejar la rama pruebas una idea que todavía no está lista.

1. Cambia el género de Pull-tergeist a `Comedia`. Guárdalo con `git add peliculas.json` y `git commit -m "wip: probar genero Comedia en Pull-tergeist"`.
2. Mira los commits de la rama: `git log --oneline rama-paranormal -3`. Copia el hash del commit `feat: agregar ficha completa de Pull-tergeist`.
3. Vuelve a la rama principal: `git switch main`.
4. Trae a `main` **únicamente** ese commit: `git cherry-pick <HASH>` (`git cherry-pick` copia un commit concreto de otra rama a la rama actual, con un hash nuevo) (sustituye `<HASH>` por el hash que copiaste). La idea a medias se queda en su rama.
5. Mira el grafo: `git log --oneline --graph --all`. El commit de Pull-tergeist aparece en `main` con un hash distinto del original, y el borrador `wip` sigue solo en `rama-paranormal`.
6. Abre `peliculas.json` y comprueba que Pull-tergeist está en `main` con el género `Terror sobrenatural`, no con `Comedia`.

> 💡 **Pistas (Comandos útiles)**: `git log --oneline rama-paranormal -3`, `git switch main`, `git cherry-pick <hash>`.

---

### 10. Limpieza y eliminación de ramas (`git branch -d`, `git branch -D`)

1. Lista las ramas: `git branch`. Existen `main`, `sotano` y `rama-paranormal`.
2. Borra `sotano`: `git branch -d sotano`. Se borra sin problema: su commit ya forma parte de `main`.
3. Intenta borrar la otra rama: `git branch -d rama-paranormal`. Git se negará con el mensaje `not fully merged`, porque el borrador `wip` nunca llegó a `main` y el commit de Pull-tergeist se copió con otro hash.
4. Como decides descartar el borrador, fuerza el borrado: `git branch -D rama-paranormal`. `-D` borra la rama aunque tenga commits sin integrar, así que perderás el borrador `wip`.
5. Lista las ramas de nuevo: `git branch`. Solo debe quedar `main`.
6. Repasa el historial final: `git log --oneline --graph`.

> 💡 **Pistas (Comandos útiles)**: `git branch`, `git branch -d <rama>`, `git branch -D <rama>`.
