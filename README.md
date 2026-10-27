# Commit Cinema

Web de la actividad de Git (Evolución del Software). 4 estudios (equipos), 30 escenas:
1-10 básico, 11-20 intermedio-avanzado (git real, checklist), 21-25 quiz, 26-30 ordenar comandos (puntúan). Clasificación en tiempo real.

## Ejecutar en local
Los módulos ES necesitan servidor HTTP:
```
npx serve .
```
Códigos de equipo: ALFA, BETA, GAMMA, DELTA (editar en `data/exercises.js`). Admin: ver `js/config.js`.

## Contenido
Editar `data/exercises.js`: los ejercicios 1-20 son placeholders (`body`, `hint`). Quiz: `options` + `answer` (índice). Orden: `steps` en el orden correcto (se barajan solos).
Puntuación: cada fallo previo resta un 25 % (mínimo 25 % del valor).

## Clasificación compartida (Firebase)
1. Crea un proyecto en Firebase y una base Firestore.
2. En local: copia `js/firebase-config.example.js` a `js/firebase-config.js` (ignorado por git) y pega ahí la config web.
   En producción la config NO está en el repo: se guarda como secret `FIREBASE_CONFIG_JSON` (JSON del objeto) y el workflow `.github/workflows/pages.yml` genera el fichero al desplegar. Restringe además la API key por dominio en Google Cloud.
3. Reglas de Firestore (entorno de clase, sin autenticación):
```
rules_version = '2';
service cloud.firestore { match /databases/{db}/documents { match /teams/{id} { allow read, write: if true; } } }
```
Sin config funciona en **modo local** (solo comparte entre pestañas del mismo navegador).

## Despliegue
GitHub Pages con GitHub Actions: Settings → Pages → Source = **GitHub Actions**; añade el secret `FIREBASE_CONFIG_JSON` en Settings → Secrets and variables → Actions; cada push a `main` despliega.

## Nota
Las respuestas correctas están en `data/exercises.js` (visibles en el código fuente). Aceptable para clase; si no, moverlas a una Cloud Function.
