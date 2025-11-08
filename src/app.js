// src/app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler");
const {
  generalLimiter,
  sanitizeInput,
  securityHeaders,
  securityLogger,
} = require("./middlewares/security");

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Middlewares de seguridad
app.use(generalLimiter);
app.use(sanitizeInput);
app.use(securityHeaders);
app.use(securityLogger);

// Ruta raíz - información de la API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🦷 API Sistema Ferreyra & Panozzo - Odontología General",
    version: "2.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      appointments: "/api/appointments",
      treatments: "/api/treatments",
    },
    status: "operational",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/treatments", treatmentRoutes);

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo centralizado de errores (debe ser el último middleware)
app.use(errorHandler);

module.exports = app;