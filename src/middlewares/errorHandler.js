const { ERROR_MESSAGES } = require("../utils/constants");

/**
 * Middleware centralizado para manejo de errores
 * @param {Error} err - Error capturado
 * @param {object} req - Request
 * {object} res - Response
 * @param {function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error("❌ Error capturado:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  // Error de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      errors: err.errors || [],
    });
  }

  // Error de Firebase Auth
  if (err.code && err.code.startsWith("auth/")) {
    return res.status(401).json({
      success: false,
      message: "Error de autenticación de Firebase",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Error personalizado con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || ERROR_MESSAGES.SERVER_ERROR,
      errors: err.errors || undefined,
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {object} req - Request
 * @param {object} res - Response
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};

/**
 * Clase para crear errores personalizados con statusCode
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
};