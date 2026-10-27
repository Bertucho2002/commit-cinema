// Capa de datos compartida. Usa Firestore si hay configuración; si no, modo local (localStorage + BroadcastChannel).
// js/firebase-config.js no está en git (lo genera el despliegue); si no existe, se usa el modo local.
async function loadFirebaseConfig() {
  try { return (await import("./firebase-config.js")).FIREBASE_CONFIG; } catch { return null; }
}

const LS_KEY = "commit-cinema-state-v1";
const emptyTeam = () => ({ done: [], answers: {}, updatedAt: 0 });

function makeLocal() {
  const listeners = new Set();
  const bc = "BroadcastChannel" in window ? new BroadcastChannel("commit-cinema") : null;
  const read = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
  const emit = () => listeners.forEach(f => f(read()));
  bc && (bc.onmessage = emit);
  window.addEventListener("storage", e => e.key === LS_KEY && emit());
  return {
    mode: "local",
    subscribe(cb) { listeners.add(cb); cb(read()); return () => listeners.delete(cb); },
    async update(teamId, fn) {
      const all = read();
      const t = all[teamId] || emptyTeam();
      fn(t); t.updatedAt = Date.now();
      all[teamId] = t;
      localStorage.setItem(LS_KEY, JSON.stringify(all));
      bc && bc.postMessage(1);
      emit();
    },
    async reset() { localStorage.removeItem(LS_KEY); bc && bc.postMessage(1); emit(); },
  };
}

async function makeFirebase(FIREBASE_CONFIG) {
  const base = "https://www.gstatic.com/firebasejs/10.12.2/";
  const { initializeApp } = await import(base + "firebase-app.js");
  const fs = await import(base + "firebase-firestore.js");
  const db = fs.getFirestore(initializeApp(FIREBASE_CONFIG));
  const col = fs.collection(db, "teams");
  return {
    mode: "firebase",
    subscribe(cb) {
      return fs.onSnapshot(col, snap => {
        const all = {};
        snap.forEach(d => (all[d.id] = d.data()));
        cb(all);
      });
    },
    async update(teamId, fn) {
      const ref = fs.doc(db, "teams", teamId);
      await fs.runTransaction(db, async tx => {
        const s = await tx.get(ref);
        const t = s.exists() ? s.data() : emptyTeam();
        t.done ??= []; t.answers ??= {};
        fn(t); t.updatedAt = Date.now();
        tx.set(ref, t);
      });
    },
    async reset() {
      const snap = await fs.getDocs(col);
      await Promise.all(snap.docs.map(d => fs.deleteDoc(d.ref)));
    },
  };
}

export async function createStore() {
  const FIREBASE_CONFIG = await loadFirebaseConfig();
  if (FIREBASE_CONFIG && FIREBASE_CONFIG.projectId) {
    try { return await makeFirebase(FIREBASE_CONFIG); } catch (e) { console.warn("Firebase no disponible, modo local", e); }
  }
  return makeLocal();
}
