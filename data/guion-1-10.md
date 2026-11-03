### 1. Crear el repositorio desde cero (`git init`, `git status`, `git commit`)

1. Crea el directorio `cine_db` y entra en él.
2. Inicializa Git con `main` como rama principal.
3. Configura tu nombre y tu correo en el repositorio.
4. Crea `peliculas.json` con esta plantilla:

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

   El bloque `_formato` es solo una referencia: indica cómo se guarda cada película. No lo borres ni lo modifiques. Las películas se irán añadiendo dentro de la lista `peliculas`, cada una como un objeto con esos tres campos. Por ejemplo, una película ya guardada tendrá este aspecto:

```json
    {
      "titulo": "Pesadilla en Main Street",
      "genero": "Slasher",
      "anio": 1984
    }
```

   Cuando haya más de una, los objetos van separados por comas, y el último no lleva coma detrás.

5. Comprueba con `git status` que el archivo aparece sin seguimiento.
6. Prepara `peliculas.json` en el *staging area*.
7. Haz el primer commit con el mensaje `feat: agregar plantilla base de peliculas.json`.
8. Mira el historial con `git log --oneline`.

---

### 2. Primera película y rama de trabajo (`git switch -c`, `git branch`)

1. En `main`, añade *"Pesadilla en Main Street"* (género `Slasher`, año `1984`) y haz commit: `feat: agregar Pesadilla en Main Street`.
2. Crea y cámbiate a una rama llamada `feature/splatter`.
3. Ejecuta `git branch` y confirma que estás en `feature/splatter`.
4. Añade, **al final** del array, *"Evil HEAD: Noche de Muertos en la Terminal"* (género `Terror`, año `1981`). Más adelante concretarás su género.
5. Haz commit: `feat: agregar Evil HEAD`.

---

### 3. Provocar y resolver un conflicto de integración (`git merge`)

1. Vuelve a `main`.
2. Cambia la línea `"titulo"` de Pesadilla a `"Pesadilla en Main Street: Edicion Clasica"` y haz commit: `feat: titulo Edicion Clasica de Pesadilla`.
3. Vuelve a `feature/splatter`.
4. Cambia **esa misma línea** a `"Pesadilla en Main Street: Version Extendida"` y haz commit: `feat: titulo Version Extendida de Pesadilla`.
5. Vuelve a `main`.
6. Intenta integrar `feature/splatter` en `main`. Git avisará de un conflicto.
7. Ejecuta `git status` y localiza el archivo en conflicto.
8. Abre `peliculas.json` y localiza los marcadores `<<<<<<<`, `=======` y `>>>>>>>`.
9. Resuelve el conflicto dejando el título original `"Pesadilla en Main Street"`. Elimina los tres marcadores y las dos versiones en conflicto: si queda alguno, el JSON no será válido.
10. Prepara el archivo y finaliza el merge con el commit `fix: resolver conflicto dejando titulo original de Pesadilla`.

> Si te pierdes a mitad del conflicto, `git merge --abort` te devuelve al estado anterior al merge.

---

### 4. Historial lineal con `git rebase`

1. Crea y cámbiate a una rama `feature/correcciones`.
2. Cambia el género de Evil HEAD de `Terror` a `Splatter` y haz commit: `fix: concretar genero de Evil HEAD`.
3. Vuelve a `main`.
4. Añade, **al principio** del array, *"El Resplandor"* (género `Terror psicologico`, año `1980`) y haz commit: `feat: agregar El Resplandor`.
5. Mira el grafo con `git log --oneline --graph --all` y comprueba que las dos ramas han divergido.
6. Cámbiate a `feature/correcciones`.
7. Muévela encima de `main` con `git rebase main`.
8. Vuelve a `main` e integra `feature/correcciones`.
9. Borra la rama `feature/correcciones`.
10. Mira de nuevo el grafo: el historial de `main` debe ser ahora una línea recta.

---

### 5. HEAD y referencias relativas (`git switch --detach`, `HEAD~`, `git branch -f`)

1. Ejecuta `git log --oneline` y localiza el commit donde está `HEAD`.
2. Viaja dos commits atrás con `git switch --detach HEAD~2`, sin crear ninguna rama.
3. Ejecuta `git status` y comprueba que aparece `HEAD detached at ...`.
4. Vuelve a `main`.
5. Crea una rama llamada `sotano` que apunte al mismo commit que `HEAD~2`, usando `git branch -f`.
6. Comprueba con `git log --oneline sotano -1` que apunta al commit del merge del ejercicio 3 (`fix: resolver conflicto dejando titulo original de Pesadilla`).

---

### 6. Deshacer errores: `git reset` y `git revert`

**Parte A: borrarlo como si nunca hubiera existido**

1. En `main`, cambia por error el año de Pesadilla de `1984` a `1948` y haz commit: `fix: corregir anio de Pesadilla`.
2. Comprueba con `git log --oneline -3` que el commit está arriba del todo.
3. Retrocede un commit descartando también los cambios del archivo, con `git reset --hard HEAD~1`.
4. Comprueba que el commit ha desaparecido del historial y que Pesadilla vuelve a tener el año `1984` en `peliculas.json`.

**Parte B: deshacerlo dejando constancia**

5. Cambia el género de Evil HEAD de `Splatter` a `Comedia` y haz commit: `fix: cambiar genero de Evil HEAD a Comedia`.
6. Deshaz su efecto con `git revert HEAD`. Guarda y cierra el editor con el mensaje por defecto.
7. Ejecuta `git log --oneline -5` y comprueba que ahora hay dos commits: el original y su `Revert`.
8. Comprueba que Evil HEAD vuelve a ser `Splatter` en `peliculas.json`.

---

### 7. Reescribir el pasado con rebase interactivo (`git rebase -i`)

El título *"El Resplandor"*, que añadiste en el ejercicio 4, debe convertirse en el juego de palabras *"El Re-base-plandor"*.

1. Ejecuta `git log --oneline` y cuenta cuántos commits hay desde `feat: agregar El Resplandor` hasta el último (ambos incluidos). Deben ser 4.
2. Abre el rebase interactivo con `git rebase -i HEAD~4`.
3. Comprueba que la lista empieza por el commit de El Resplandor. Si ves commits de antes del merge del ejercicio 3, has contado de más: sal con `git rebase --abort` y repite el paso 2 con el número correcto.
4. Cambia `pick` por `edit` en la línea de El Resplandor. Recuerda que la lista va del commit más antiguo al más reciente, al revés que `git log`.
5. Guarda y cierra el editor: Git se detendrá en ese commit.
6. Cambia el título en `peliculas.json` a `"El Re-base-plandor"`.
7. Prepara el archivo con `git add` y actualiza el commit con `git commit --amend --no-edit`.
8. Finaliza con `git rebase --continue`.
9. Comprueba con `git log --oneline -S"Re-base-plandor"` que el cambio quedó en el commit `feat: agregar El Resplandor`.

---

### 8. Unificar commits desordenados: *squash* (`git rebase -i`)

**Parte A: tres commits descuidados**

1. Añade, **al principio** del array, *"The Texas Chainsaw Merge"* con género `slasher` (en minúscula) y año `1973`. Haz commit: `feat: inicio Texas Chainsaw`.
2. Cambia el año a `1974` y haz commit: `fix: corregir anio Texas Chainsaw`.
3. Cambia el género a `Slasher` (con mayúscula) y haz commit: `style: capitalizar genero Texas Chainsaw`.
4. Comprueba con `git log --oneline -4` que los tres commits están arriba.

**Parte B: unirlos en uno**

5. Abre el rebase interactivo sobre los 3 últimos commits con `git rebase -i HEAD~3`.
6. Deja el primer commit como `pick` y cambia los otros dos a `squash` (o `s`).
7. Guarda y cierra. Se abrirá un segundo editor con los tres mensajes juntos.
8. Borra todo el contenido y escribe un único mensaje: `feat: agregar ficha completa de The Texas Chainsaw Merge`.
9. Guarda y cierra.
10. Comprueba con `git log --oneline -3` que ahora hay un solo commit en lugar de tres.

---

### 9. Rescatar un commit de otra rama (`git cherry-pick`)

1. Crea y cámbiate a una rama `rama-paranormal`.
2. Añade, **al final** del array, *"Pull-tergeist: Juegos Diabolicos"* (género `Terror sobrenatural`, año `1982`) y haz commit: `feat: agregar Pull-tergeist`.
3. Haz un experimento: cambia el año de Pull-tergeist a `2099` y haz commit: `wip: probar anio 2099 en Pull-tergeist`. Este cambio no debe llegar a `main`.
4. Ejecuta `git log --oneline rama-paranormal -3` y copia el hash del commit `feat: agregar Pull-tergeist`.
5. Vuelve a `main`.
6. Trae a `main` **únicamente** ese commit con `git cherry-pick <HASH>`.
7. Mira el grafo con `git log --oneline --graph --all`: el commit de Pull-tergeist aparece en `main` con un hash distinto del original, y el experimento sigue solo en `rama-paranormal`.
8. Comprueba que en `peliculas.json` Pull-tergeist está con el año `1982`, no con `2099`.

---

### 10. Limpieza y eliminación de ramas (`git branch -d`, `git branch -D`)

1. Ejecuta `git branch` y comprueba que existen `feature/splatter`, `sotano` y `rama-paranormal`.
2. Borra `feature/splatter` con `git branch -d`.
3. Borra `sotano` con `git branch -d`.
4. Intenta borrar `rama-paranormal` con `git branch -d`. Git se negará con el mensaje `not fully merged`, porque el experimento del año 2099 nunca llegó a `main`.
5. Como decides descartar el experimento, fuerza el borrado de `rama-paranormal` con `git branch -D`.
6. Ejecuta `git branch`: solo debe quedar `main`.
7. Ejecuta `git log --oneline` por última vez y repasa el historial final.
