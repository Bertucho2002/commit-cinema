// Contenido de la actividad. Los enunciados 1-10 son PLACEHOLDERS: sustituir `body` (admite markdown básico).
// Los enunciados 11-20 se cargan en runtime desde data/guion-11-20.md (ver loadGuion al final).
// type: "task" (1-20, solo checklist) | "quiz" (opción múltiple) | "order" (ordenar comandos)

export const TEAMS = [
  { id: "a", name: "JAL",  color: "#c77dff", code: "ALFA" },
  { id: "b", name: "Los ReBasados",  color: "#00e5ff", code: "BETA" },
  { id: "c", name: "Escape Team", color: "#b6ff3b", code: "GAMMA" },
  { id: "d", name: "Gitabama", color: "#ff9f1c", code: "DELTA" },
];

export const LEVELS = {
  basic: { label: "Acto I · Básico", range: "1-10" },
  mid:   { label: "Acto II · Intermedio-avanzado", range: "11-20" },
  final: { label: "Acto III · Gran final", range: "21-30" },
};

const task = (id, level, title) => ({
  id, level, type: "task", title,
  body: "TODO: enunciado del ejercicio " + id + ".\n\nEjemplo de comando: `git status`",
  hint: "TODO: pista opcional.",
});

export const EXERCISES = [
  // --- Acto I: básico (1-10)
  task(1, "basic", "Claqueta: inicializa el rodaje"),
  task(2, "basic", "Primer guion: crea tu primer fichero"),
  task(3, "basic", "Casting: git add"),
  task(4, "basic", "Primera toma: git commit"),
  task(5, "basic", "Revisando la cinta: git log"),
  task(6, "basic", "Escena eliminada: git restore"),
  task(7, "basic", "Ignorar el catering: .gitignore"),
  task(8, "basic", "Diferencias entre tomas: git diff"),
  task(9, "basic", "Corrige el título: git commit --amend"),
  task(10, "basic", "Vuelta atrás: git revert"),
  // --- Acto II: intermedio-avanzado (11-20)
  task(11, "mid", "Final alternativo: git branch / switch"),
  task(12, "mid", "Montaje: git merge"),
  task(13, "mid", "Conflicto de guionistas"),
  task(14, "mid", "Resolviendo el conflicto"),
  task(15, "mid", "Estudio en la nube: git remote / push"),
  task(16, "mid", "Colaboración: git clone y pull"),
  task(17, "mid", "Pull Request al director"),
  task(18, "mid", "Reescribiendo la historia: git rebase"),
  task(19, "mid", "Guardar para luego: git stash"),
  task(20, "mid", "Estreno: git tag"),
  // --- Acto III: gran final (21-30). Mezcla de quiz y ordenar comandos; `answer` = índice de la opción correcta.
  {
    id: 21, level: "final", type: "quiz", points: 10, title: "¿Dónde están mis cambios?",
    body: "Has añadido una película a `peliculas.json` y guardado el archivo, pero todavía no has ejecutado `git add`. ¿Dónde están esos cambios?",
    options: ["Ya en el historial, confirmados", "En tu directorio de trabajo, modificados pero sin preparar", "En el remoto, en GitHub", "En la pila del `stash`"],
    answer: 1,
  },
  {
    id: 22, level: "final", type: "order", points: 15, title: "Estreno de la cartelera",
    body: "Ordena los comandos para crear el repositorio de Commit_Cinema y guardar la plantilla de `peliculas.json`.",
    steps: ["git init -b main", "git add peliculas.json", 'git commit -m "feat: agregar plantilla base de peliculas.json"', "git log --oneline"],
  },
  {
    id: 23, level: "final", type: "quiz", points: 10, title: "Una línea recta con rebase",
    body: "Tras hacer `git rebase main` en `feature/correcciones` y fusionarla en `main`, el historial queda en línea recta. ¿Por qué?",
    options: ["Porque Git borra la rama al fusionarla", "Porque `merge` siempre genera historiales lineales", "Porque `rebase` coloca los commits de la rama encima de `main` y el merge es un *fast-forward*", "Porque se usa `--force`"],
    answer: 2,
  },
  {
    id: 24, level: "final", type: "quiz", points: 10, title: "El distribuidor retira la película",
    body: "El commit que añadió *The Texas Chainsaw Merge* ya está en el historial y el distribuidor retira la película. Quieres deshacerlo dejando constancia, sin borrar nada. ¿Qué haces?",
    options: ["`git reset --hard HEAD~1` y después `git push --force`", "Borrar la carpeta `.git` y empezar de nuevo", "`git branch -D main`", "`git revert <hash>`"],
    answer: 3,
  },
  {
    id: 25, level: "final", type: "order", points: 15, title: "Push rechazado",
    body: "Has hecho commit de la portada de *El Grinch*, pero tu compañero A subió cambios antes que tú. Ordena lo que ocurre hasta que tu push es aceptado.",
    steps: ['git commit -m "feat: portada de El Grinch"', "git push origin feature/cartelera-navidad   # rechazado", "git pull origin feature/cartelera-navidad", "git push origin feature/cartelera-navidad   # aceptado"],
  },
  {
    id: 26, level: "final", type: "quiz", points: 10, title: "Una urgencia en mitad del trabajo",
    body: "Tienes cambios sin confirmar en `index.html` y necesitas cambiar de rama un momento. ¿Qué comando los guarda de forma temporal y deja el directorio limpio?",
    options: ["`git stash`", "`git revert HEAD`", "`git reset --hard`", "`git branch -d`"],
    answer: 0,
  },
  {
    id: 27, level: "final", type: "order", points: 15, title: "Conflicto en el Hero Banner",
    body: "Al fusionar `feature/decoracion-navidad` en `main`, Git avisa de un conflicto en `index.html`. Ordena la resolución.",
    steps: ["git merge feature/decoracion-navidad   # CONFLICTO", "(editar index.html: dejar una sola línea y borrar <<<<<<<, ======= y >>>>>>>)", "git add index.html", 'git commit -m "merge: resolver conflicto del titulo"'],
  },
  {
    id: 28, level: "final", type: "order", points: 15, title: "Solo el código promocional",
    body: "Estás en `main` y quieres traer únicamente el commit de la promo que hizo B en `origin/experimento/promo`. Ordena los comandos.",
    steps: ["git fetch", "git log origin/experimento/promo --oneline -n 1   # copiar el hash", "git cherry-pick <hash>", "git push"],
  },
  {
    id: 29, level: "final", type: "quiz", points: 10, title: "Etiqueta de versión",
    body: "¿Para qué sirve la etiqueta anotada `v2.0.0-navidad`?",
    options: ["Crea una rama nueva para la campaña de Navidad", "Sube los cambios a GitHub", "Marca un punto concreto del historial como versión, con autor, fecha y mensaje", "Fusiona dos ramas"],
    answer: 2,
  },
  {
    id: 30, level: "final", type: "order", points: 15, title: "Lanzamiento de la campaña",
    body: "Ordena los comandos para publicar la versión `v2.0.0-navidad` de la web y comprobar el resultado al final.",
    steps: ["git switch main", 'git tag -a v2.0.0-navidad -m "Lanzamiento oficial de la web navidena"', "git push origin main --tags", "git log --oneline --graph --all --decorate"],
  },
];

// Introducción de cada acto (clave = level), se rellena en loadGuion.
export const GUION = { intros: {} };

// Carga los guiones en markdown y sustituye título, enunciado, pista y duración de cada ejercicio encontrado.
// Cabeceras aceptadas: "### Pregunta N: Título (Tiempo: X min)" o "### N. Título (`cmd1`, `cmd2`)".
// Una línea final "> 💡 **Pistas...**: ..." se usa como pista. Si falla la carga se conservan los placeholders.
export async function loadGuion(urls = ["data/guion-1-10.md", "data/guion-11-20.md"]) {
  await Promise.all(urls.map(loadOne));
}

async function loadOne(url) {
  let text;
  try {
    const r = await fetch(url + "?v=6"); // mismo número de versión que en index.html
    if (!r.ok) throw new Error(r.status);
    text = (await r.text()).replace(/\r\n/g, "\n");
  } catch (e) { console.warn("No se pudo cargar el guion", url, e); return; }

  const re = /^### (?:Pregunta )?(\d+)[.:]\s*(.+?)\s*$/gm;
  const heads = [...text.matchAll(re)];

  // Introducción opcional del acto: la sección "### Contexto..." (hasta la primera línea "---") o, si no existe,
  // el texto que hay entre el título del documento y el primer ejercicio.
  const ctx = text.match(/^### Contexto[^\n]*\n([\s\S]*?)\n---\s*$/m);
  const pre = heads.length ? text.slice(0, heads[0].index).replace(/^#{1,2} .*$/gm, "").replace(/\n---\s*$/, "").trim() : "";
  const intro = (ctx ? ctx[1] : pre).trim();
  const level = EXERCISES.find(e => heads.length && e.id === +heads[0][1])?.level;
  if (intro && level) GUION.intros[level] = intro;

  heads.forEach((h, i) => {
    const ex = EXERCISES.find(e => e.id === +h[1]);
    if (!ex) return;
    const end = i + 1 < heads.length ? heads[i + 1].index : text.length;
    let body = text.slice(h.index + h[0].length, end).replace(/\n---\s*$/, "").trim();
    const hint = body.match(/^>\s*💡\s*\*\*[^*]+\*\*:\s*(.*)$/m);
    ex.hint = hint ? hint[1].trim() : undefined;
    if (hint) body = body.slice(0, hint.index).trim();

    let title = h[2];
    const time = title.match(/\s*\(Tiempo:\s*(\d+)\s*min\)$/);
    if (time) { ex.minutes = +time[1]; title = title.slice(0, time.index); }
    const cmds = title.match(/\s*\((`[^)]*`)\)$/); // "(`git init`, `git status`)" -> comandos
    if (cmds) { ex.commands = cmds[1]; title = title.slice(0, cmds.index); }
    ex.title = title;
    ex.body = body;
  });
}
