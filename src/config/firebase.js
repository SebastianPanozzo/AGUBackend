const admin = require("firebase-admin");

/**
 * Inicialización de Firebase Admin SDK
 * Soporta tanto credenciales desde archivo local como desde variable de entorno
 */
if (!admin.apps.length) {
  let credential;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Producción (Render) - desde variable de entorno
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    );
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Desarrollo local - desde archivo
    credential = admin.credential.cert(
      require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    );
  } else {
    throw new Error(
      "No se encontraron credenciales de Firebase. Configure GOOGLE_APPLICATION_CREDENTIALS o GOOGLE_APPLICATION_CREDENTIALS_JSON"
    );
  }

  admin.initializeApp({
    credential: credential,
  });

  console.log("✅ Firebase Admin SDK inicializado correctamente");
}

const db = admin.firestore();

// Configuración de Firestore
db.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
});

module.exports = { db, admin };