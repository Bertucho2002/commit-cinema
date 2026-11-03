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
  // --- Acto III: cuestionarios (21-25)
  {
    id: 21, level: "final", type: "quiz", points: 10, title: "¿Qué hace git add?",
    body: "Elige la opción correcta.",
    options: ["Crea un commit", "Mueve cambios al área de preparación (staging)", "Sube cambios al remoto", "Crea una rama"],
    answer: 1,
  },
  {
    id: 22, level: "final", type: "quiz", points: 10, title: "HEAD",
    body: "¿Qué es `HEAD`?",
    options: ["La primera confirmación del repositorio", "Un puntero a la rama o commit actualmente en uso", "La rama remota por defecto", "El último tag creado"],
    answer: 1,
  },
  {
    id: 23, level: "final", type: "quiz", points: 10, title: "Merge vs rebase",
    body: "¿Cuál es una diferencia clave entre `git merge` y `git rebase`?",
    options: ["Rebase reescribe la historia moviendo commits; merge crea un commit de fusión", "Merge borra la rama origen", "Rebase solo funciona con remotos", "No hay ninguna diferencia"],
    answer: 0,
  },
  {
    id: 24, level: "final", type: "quiz", points: 10, title: "Deshacer con seguridad",
    body: "Un commit ya está publicado en `origin`. ¿Cómo lo deshaces sin reescribir historia compartida?",
    options: ["`git reset --hard` y `git push --force`", "`git revert <commit>`", "`git rebase -i` y borrar la línea", "Borrar la carpeta `.git`"],
    answer: 1,
  },
  {
    id: 25, level: "final", type: "quiz", points: 10, title: "Fetch vs pull",
    body: "`git pull` equivale a…",
    options: ["`git fetch` + `git merge` (o rebase)", "`git push` + `git fetch`", "`git clone` + `git checkout`", "`git stash` + `git apply`"],
    answer: 0,
  },
  // --- Acto III: ordenar comandos (26-30)
  {
    id: 26, level: "final", type: "order", points: 15, title: "Primer commit",
    body: "Ordena los comandos para crear un repo y hacer tu primer commit.",
    steps: ["git init", "git add README.md", 'git commit -m "Primer commit"'],
  },
  {
    id: 27, level: "final", type: "order", points: 15, title: "Rama de feature",
    body: "Crea una rama, haz un cambio y fusiónalo en main.",
    steps: ["git switch -c escena-extra", "git add .", 'git commit -m "Añade escena extra"', "git switch main", "git merge escena-extra"],
  },
  {
    id: 28, level: "final", type: "order", points: 15, title: "Resolver conflicto",
    body: "Un merge ha dado conflicto. Ordena la resolución.",
    steps: ["git merge otra-rama", "(editar el fichero y quitar las marcas <<<<<<<)", "git add guion.txt", "git commit"],
  },
  {
    id: 29, level: "final", type: "order", points: 15, title: "Colaborar con GitHub",
    body: "Ordena el flujo para subir una contribución.",
    steps: ["git clone <url>", "git switch -c mi-cambio", 'git commit -am "Mi cambio"', "git push -u origin mi-cambio"],
  },
  {
    id: 30, level: "final", type: "order", points: 15, title: "Salvar el trabajo a medias",
    body: "Estás a medias y debes cambiar de rama un momento.",
    steps: ["git stash", "git switch hotfix", "git switch -", "git stash pop"],
  },
];

// Contexto común del Acto II (se rellena en loadGuion).
export const GUION = { intro: "" };

// Carga los guiones en markdown y sustituye título, enunciado, pista y duración de cada ejercicio encontrado.
// Cabeceras aceptadas: "### Pregunta N: Título (Tiempo: X min)" o "### N. Título (`cmd1`, `cmd2`)".
// Una línea final "> 💡 **Pistas...**: ..." se usa como pista. Si falla la carga se conservan los placeholders.
export async function loadGuion(urls = ["data/guion-1-10.md", "data/guion-11-20.md"]) {
  await Promise.all(urls.map(loadOne));
}

async function loadOne(url) {
  let text;
  try {
    const r = await fetch(url + "?v=2"); // mismo número de versión que en index.html
    if (!r.ok) throw new Error(r.status);
    text = (await r.text()).replace(/\r\n/g, "\n");
  } catch (e) { console.warn("No se pudo cargar el guion", url, e); return; }

  const re = /^### (?:Pregunta )?(\d+)[.:]\s*(.+?)\s*$/gm;
  const heads = [...text.matchAll(re)];

  // Introducción opcional: desde "### Contexto..." hasta la primera línea "---".
  const ctx = text.match(/^### Contexto[^\n]*\n([\s\S]*?)\n---\s*$/m);
  if (ctx) GUION.intro = ctx[1].trim();

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
