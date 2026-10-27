// La configuración de Firebase NO está en el repositorio: vive en js/firebase-config.js
// (ignorado por git). En producción lo genera el workflow de GitHub Actions a partir del secret
// FIREBASE_CONFIG_JSON; en local copia js/firebase-config.example.js a js/firebase-config.js y rellénalo.
// Sin ese fichero la web funciona en MODO LOCAL (el ranking solo se comparte entre pestañas del mismo navegador).

// Código para el botón de reiniciar partida (profesor / grupo).
export const ADMIN_CODE = "CLAQUETA";
