import { TEAMS, LEVELS, EXERCISES } from "../data/exercises.js";
import { ADMIN_CODE } from "./config.js";
import { createStore } from "./store.js";

const $app = document.getElementById("app");
const $who = document.getElementById("who");
const $banner = document.getElementById("banner");

let store, data = {};
let teamId = safeGet("cc-team");
let orderState = null; // { exId, items }

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} }

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const md = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
const team = id => TEAMS.find(t => t.id === id);
const teamData = id => data[id] || { done: [], answers: {} };
const scoreOf = id => Object.values(teamData(id).answers || {}).reduce((n, a) => n + (a.points || 0), 0);
const doneTasks = id => (teamData(id).done || []).length;
const solved = (id, ex) => !!teamData(id).answers?.[ex.id]?.correct;

// ---------- puntuación: cada fallo previo resta 25% (mínimo 25% del valor)
const pointsFor = (base, attempts) => Math.round(base * Math.max(0.25, 1 - 0.25 * (attempts - 1)));

// ---------- barajado determinista por ejercicio
function shuffled(arr, seed) {
  const a = [...arr]; let s = seed * 9301 + 49297;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.join() === arr.join() ? a.reverse() : a;
}

// ---------- vistas
function viewLogin() {
  $app.innerHTML = `
    <section class="panel center">
      <h1>Elige tu estudio</h1>
      <p class="muted">Cada equipo rueda su propia película. Introduce el código de tu estudio.</p>
      <div class="teams">
        ${TEAMS.map(t => `<button class="team-card" data-team="${t.id}" style="--c:${t.color}"><b>${esc(t.name)}</b></button>`).join("")}
      </div>
      <form id="codeForm" hidden>
        <input id="code" placeholder="Código del estudio" autocomplete="off">
        <button class="btn">Entrar</button>
        <p class="err" id="codeErr"></p>
      </form>
    </section>`;
  let pick = null;
  const form = $app.querySelector("#codeForm");
  $app.querySelectorAll("[data-team]").forEach(b => b.onclick = () => {
    pick = team(b.dataset.team); form.hidden = false; form.querySelector("input").focus();
  });
  form.onsubmit = e => {
    e.preventDefault();
    if (form.code.value.trim().toUpperCase() === pick.code) { teamId = pick.id; safeSet("cc-team", teamId); location.hash = "#/"; }
    else $app.querySelector("#codeErr").textContent = "Código incorrecto.";
  };
}

function viewMap() {
  const t = team(teamId);
  const total = EXERCISES.length;
  const doneCount = doneTasks(teamId) + EXERCISES.filter(e => e.type !== "task" && solved(teamId, e)).length;
  $app.innerHTML = `
    <section class="hero" style="--c:${t.color}">
      <div><h1>${esc(t.name)}</h1><p class="muted">${doneCount}/${total} escenas rodadas · <b>${scoreOf(teamId)}</b> puntos</p></div>
      <div class="bar"><i style="width:${(doneCount / total) * 100}%"></i></div>
    </section>
    ${Object.entries(LEVELS).map(([k, L]) => `
      <h2 class="act">${L.label} <small>${L.range}</small></h2>
      <div class="reel">
        ${EXERCISES.filter(e => e.level === k).map(e => {
          const ok = e.type === "task" ? teamData(teamId).done?.includes(e.id) : solved(teamId, e);
          return `<a class="clap ${ok ? "ok" : ""} ${e.type}" href="#/ex/${e.id}"><span class="n">${e.id}</span><span class="t">${esc(e.title)}</span><span class="k">${e.type === "task" ? "git real" : e.type === "quiz" ? "quiz" : "ordenar"}${ok ? " ✓" : ""}</span></a>`;
        }).join("")}
      </div>`).join("")}`;
}

function viewExercise(id) {
  const ex = EXERCISES.find(e => e.id === id);
  if (!ex) return (location.hash = "#/");
  const prev = EXERCISES.find(e => e.id === id - 1), next = EXERCISES.find(e => e.id === id + 1);
  const nav = `<div class="pager">${prev ? `<a class="btn ghost" href="#/ex/${prev.id}">← ${prev.id}</a>` : "<span></span>"}<a class="btn ghost" href="#/">Mapa</a>${next ? `<a class="btn ghost" href="#/ex/${next.id}">${next.id} →</a>` : "<span></span>"}</div>`;
  const head = `<p class="muted">${LEVELS[ex.level].label} · Escena ${ex.id}</p><h1>${esc(ex.title)}</h1>${md(ex.body)}`;
  let body = "";

  if (ex.type === "task") {
    const done = teamData(teamId).done?.includes(ex.id);
    body = `${ex.hint ? `<details><summary>Pista</summary>${md(ex.hint)}</details>` : ""}
      <label class="check"><input type="checkbox" id="doneBox" ${done ? "checked" : ""}> Hecho — mi equipo ha completado este ejercicio</label>`;
  } else if (ex.type === "quiz") {
    const a = teamData(teamId).answers?.[ex.id];
    body = `<div class="opts">${ex.options.map((o, i) =>
      `<button class="opt" data-i="${i}" ${a?.correct ? "disabled" : ""}>${esc(o).replace(/`([^`]+)`/g, "<code>$1</code>")}</button>`).join("")}</div>
      <p class="msg" id="msg">${a?.correct ? `✅ Resuelto: +${a.points} puntos` : a ? `Intentos fallidos: ${a.attempts}` : ""}</p>`;
  } else {
    const a = teamData(teamId).answers?.[ex.id];
    if (!orderState || orderState.exId !== ex.id) orderState = { exId: ex.id, items: a?.correct ? [...ex.steps] : shuffled(ex.steps, ex.id) };
    body = `<ol id="order" class="order"></ol>
      <button class="btn" id="checkOrder" ${a?.correct ? "disabled" : ""}>Comprobar</button>
      <p class="msg" id="msg">${a?.correct ? `✅ Resuelto: +${a.points} puntos` : a ? `Intentos fallidos: ${a.attempts}` : ""}</p>`;
  }
  $app.innerHTML = `<section class="panel">${head}${body}</section>${nav}`;

  if (ex.type === "task") {
    $app.querySelector("#doneBox").onchange = e => store.update(teamId, t => {
      t.done ??= []; const has = t.done.includes(ex.id);
      if (e.target.checked && !has) t.done.push(ex.id);
      if (!e.target.checked && has) t.done = t.done.filter(x => x !== ex.id);
    });
  } else if (ex.type === "quiz") {
    $app.querySelectorAll(".opt").forEach(b => b.onclick = () => submit(ex, +b.dataset.i === ex.answer));
  } else {
    renderOrder(ex);
    $app.querySelector("#checkOrder").onclick = () => submit(ex, orderState.items.join("\n") === ex.steps.join("\n"));
  }
}

function renderOrder(ex) {
  const ol = $app.querySelector("#order");
  const locked = teamData(teamId).answers?.[ex.id]?.correct;
  ol.innerHTML = orderState.items.map((s, i) => `
    <li draggable="${!locked}" data-i="${i}"><code>${esc(s)}</code>
      ${locked ? "" : `<span><button data-mv="-1" aria-label="Subir">↑</button><button data-mv="1" aria-label="Bajar">↓</button></span>`}</li>`).join("");
  const move = (from, to) => {
    if (to < 0 || to >= orderState.items.length) return;
    const [x] = orderState.items.splice(from, 1); orderState.items.splice(to, 0, x); renderOrder(ex);
  };
  ol.querySelectorAll("li").forEach(li => {
    const i = +li.dataset.i;
    li.ondragstart = e => { e.dataTransfer.setData("text/plain", i); li.classList.add("drag"); };
    li.ondragend = () => li.classList.remove("drag");
    li.ondragover = e => e.preventDefault();
    li.ondrop = e => { e.preventDefault(); move(+e.dataTransfer.getData("text/plain"), i); };
    li.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => move(i, i + +b.dataset.mv));
  });
}

async function submit(ex, ok) {
  await store.update(teamId, t => {
    t.answers ??= {};
    const a = t.answers[ex.id] || { attempts: 0, correct: false, points: 0 };
    if (a.correct) return; // no se puede puntuar dos veces
    a.attempts += 1;
    if (ok) { a.correct = true; a.points = pointsFor(ex.points, a.attempts); }
    t.answers[ex.id] = a;
  });
  const msg = $app.querySelector("#msg");
  if (!ok && msg) { msg.textContent = "❌ Incorrecto. ¡Corten! Prueba otra toma (cada fallo resta puntos)."; msg.className = "msg bad"; }
}

function viewRanking() {
  const rows = TEAMS.map(t => ({ t, pts: scoreOf(t.id), done: doneTasks(t.id), solved: EXERCISES.filter(e => e.type !== "task" && solved(t.id, e)).length, ts: teamData(t.id).updatedAt || 9e15 }))
    .sort((a, b) => b.pts - a.pts || b.done - a.done || a.ts - b.ts);
  const tasks = EXERCISES.filter(e => e.type === "task").length, inter = EXERCISES.length - tasks;
  $app.innerHTML = `
    <section class="panel"><h1>🏆 Clasificación</h1>
    <table class="rank"><thead><tr><th>#</th><th>Estudio</th><th>Puntos</th><th>Git real (1-20)</th><th>Quiz/Orden (21-30)</th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr class="${r.t.id === teamId ? "me" : ""}" style="--c:${r.t.color}"><td>${["🥇", "🥈", "🥉"][i] || i + 1}</td><td><b>${esc(r.t.name)}</b></td><td class="pts">${r.pts}</td>
      <td><div class="bar sm"><i style="width:${r.done / tasks * 100}%"></i></div>${r.done}/${tasks}</td><td>${r.solved}/${inter}</td></tr>`).join("")}
    </tbody></table>
    <p class="muted">Desempate: más ejercicios de git completados y, después, quien llegó antes.</p>
    <details><summary>Admin</summary><form id="adminForm"><input id="adm" placeholder="Código admin" autocomplete="off"><button class="btn danger">Reiniciar partida</button></form></details></section>`;
  $app.querySelector("#adminForm").onsubmit = async e => {
    e.preventDefault();
    if (e.target.adm.value === ADMIN_CODE && confirm("¿Borrar TODA la puntuación y el progreso de todos los equipos?")) { await store.reset(); }
  };
}

// ---------- shell
function render() {
  const h = location.hash.replace(/^#/, "") || "/";
  $who.innerHTML = teamId ? `<span class="chip" style="--c:${team(teamId).color}">${esc(team(teamId).name)}</span> <button class="link" id="logout">salir</button>` : "";
  const lo = document.getElementById("logout"); if (lo) lo.onclick = () => { teamId = null; safeSet("cc-team", null); location.hash = "#/"; render(); };
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", (a.dataset.nav === "ranking") === (h === "/ranking")));
  if (h === "/ranking") return viewRanking();
  if (!teamId) return viewLogin();
  const m = h.match(/^\/ex\/(\d+)$/);
  m ? viewExercise(+m[1]) : viewMap();
}

(async () => {
  store = await createStore();
  if (store.mode === "local") { $banner.hidden = false; $banner.textContent = "Modo local: sin Firebase configurado, la clasificación solo se comparte entre pestañas de este navegador (ver js/config.js)."; }
  let first = true;
  store.subscribe(all => {
    data = all || {};
    // No re-renderizar la vista de ejercicio si se está arrastrando/ordenando, salvo en la primera carga
    const inEx = /^#\/ex\//.test(location.hash);
    if (first || !inEx) render(); else syncExercise();
    first = false;
  });
  window.addEventListener("hashchange", render);
})();

// Actualiza solo el estado de la vista de ejercicio abierta cuando cambian los datos (p. ej. otra pestaña).
function syncExercise() {
  const id = +location.hash.split("/").pop(), ex = EXERCISES.find(e => e.id === id);
  if (ex && ex.type !== "order") render();
  else if (ex) { const a = teamData(teamId).answers?.[ex.id]; if (a?.correct) render(); }
}
