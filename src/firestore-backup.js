require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { db } = require("./config/firebase");

const BACKUP_DIR = "./backups";

/**
 * Realizar backup de todas las colecciones de Firestore
 */
async function backupAll() {
  console.log("\n🔄 Iniciando backup de Firestore...\n");

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
    console.log(`📁 Carpeta '${BACKUP_DIR}' creada`);
  }

  try {
    const collections = await db.listCollections();

    for (const col of collections) {
      const snapshot = await col.get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convertir Timestamps de Firebase a strings para JSON
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        birthdate: doc.data().birthdate?.toDate().toISOString(),
      }));

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${col.id}_${timestamp}.json`;
      const filePath = path.join(BACKUP_DIR, filename);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(
        `✅ Backup de colección '${col.id}' guardado: ${data.length} documentos`
      );
    }

    console.log("\n🎉 Backup completado exitosamente\n");
  } catch (error) {
    console.error("\n❌ Error durante el backup:", error.message);
    process.exit(1);
  }
}

/**
 * Restaurar todas las colecciones desde archivos JSON
 */
async function restoreAll() {
  console.log("\n🔄 Iniciando restauración desde backup...\n");

  if (!fs.existsSync(BACKUP_DIR)) {
    console.error(
      `❌ No existe la carpeta '${BACKUP_DIR}'. Realice un backup primero.`
    );
    process.exit(1);
  }

  try {
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.endsWith(".json"));

    if (files.length === 0) {
      console.error("❌ No se encontraron archivos de backup");
      process.exit(1);
    }

    console.log(`📦 Encontrados ${files.length} archivos de backup\n`);

    for (const file of files) {
      // Extraer nombre de colección (eliminar timestamp y .json)
      const collectionName = file.split("_")[0];
      const rawData = fs.readFileSync(path.join(BACKUP_DIR, file));
      const documents = JSON.parse(rawData);

      console.log(`⏳ Restaurando colección '${collectionName}'...`);

      for (const doc of documents) {
        const { id, ...data } = doc;

        // Convertir strings de fecha de vuelta a Timestamps de Firebase
        if (data.createdAt) {
          data.createdAt = new Date(data.createdAt);
        }
        if (data.updatedAt) {
          data.updatedAt = new Date(data.updatedAt);
        }
        if (data.birthdate) {
          data.birthdate = new Date(data.birthdate);
        }

        await db.collection(collectionName).doc(id).set(data);
      }

      console.log(
        `✅ Restaurada colección '${collectionName}': ${documents.length} documentos`
      );
    }

    console.log("\n🎉 Restauración completada exitosamente\n");
  } catch (error) {
    console.error("\n❌ Error durante la restauración:", error.message);
    process.exit(1);
  }
}

/**
 * Restaurar desde un archivo específico
 * @param {string} filename - Nombre del archivo
 */
async function restoreFromFile(filename) {
  console.log(`\n🔄 Restaurando desde archivo: ${filename}\n`);

  const filePath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    process.exit(1);
  }

  try {
    const collectionName = filename.split("_")[0];
    const rawData = fs.readFileSync(filePath);
    const documents = JSON.parse(rawData);

    console.log(`⏳ Restaurando colección '${collectionName}'...`);

    for (const doc of documents) {
      const { id, ...data } = doc;

      if (data.createdAt) data.createdAt = new Date(data.createdAt);
      if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
      if (data.birthdate) data.birthdate = new Date(data.birthdate);

      await db.collection(collectionName).doc(id).set(data);
    }

    console.log(
      `✅ Restauración completada: ${documents.length} documentos\n`
    );
  } catch (error) {
    console.error("\n❌ Error durante la restauración:", error.message);
    process.exit(1);
  }
}

// CLI - Ejecutar según argumentos
const action = process.argv[2];
const filename = process.argv[3];

if (action === "backup") {
  backupAll().then(() => process.exit(0));
} else if (action === "restore") {
  if (filename) {
    restoreFromFile(filename).then(() => process.exit(0));
  } else {
    restoreAll().then(() => process.exit(0));
  }
} else {
  console.log("\n📚 Sistema de Backup y Restauración - Firestore\n");
  console.log("Comandos disponibles:");
  console.log("  npm run backup           - Realizar backup completo");
  console.log("  npm run restore          - Restaurar desde último backup");
  console.log(
    "  npm run restore <file>   - Restaurar desde archivo específico\n"
  );
  process.exit(0);
}