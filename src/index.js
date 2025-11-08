require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🦷  SISTEMA FERREYRA & PANOZZO - ODONTOLOGÍA GENERAL");
  console.log("=".repeat(60));
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log("=".repeat(60) + "\n");
});

// Manejo de errores no capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Cerrar servidor gracefully
  server.close(() => {
    console.log("🔴 Servidor cerrado debido a error no manejado");
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Cerrar servidor gracefully
  server.close(() => {
    console.log("🔴 Servidor cerrado debido a excepción no capturada");
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n👋 SIGTERM recibido. Cerrando servidor gracefully...");
  server.close(() => {
    console.log("🔴 Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n👋 SIGINT recibido. Cerrando servidor gracefully...");
  server.close(() => {
    console.log("🔴 Servidor cerrado");
    process.exit(0);
  });
});