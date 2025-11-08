// src/middleware/security.js
const rateLimit = require("express-rate-limit");

/**
 * Middlewares de Seguridad
 * Incluye rate limiting, sanitización y headers de seguridad
 */

// Rate limiting para login (prevenir fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    success: false,
    message: "Demasiados intentos de login. Intente nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiting para registro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros
  message: {
    success: false,
    message: "Demasiados registros. Intente nuevamente en una hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting general para API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests
  message: {
    success: false,
    message: "Demasiadas peticiones. Intente nuevamente más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware para sanitizar entradas y prevenir inyecciones NoSQL
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const sanitizeInput = (req, res, next) => {
  const dangerousChars = ["$", "{", "}", "&&", "||", "==", "!="];

  const sanitizeObject = (obj) => {
    if (typeof obj === "string") {
      let sanitized = obj;
      dangerousChars.forEach((char) => {
        const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        sanitized = sanitized.replace(new RegExp(escapedChar, "g"), "");
      });
      return sanitized.trim();
    }

    if (typeof obj === "object" && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        // No permitir keys que empiecen con $ (operadores NoSQL)
        if (!key.startsWith("$")) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Middleware para agregar headers de seguridad
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevenir clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevenir MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // XSS Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  next();
};

/**
 * Middleware para logging de operaciones de seguridad
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const securityLogger = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("User-Agent") || "Unknown";
  const timestamp = new Date().toISOString();

  // Log de intentos de login
  if (req.path === "/api/auth/login" && req.method === "POST") {
    console.log(
      `[SECURITY] Login attempt - IP: ${clientIP}, UserAgent: ${userAgent}, Time: ${timestamp}`
    );
  }

  // Log de registros
  if (req.path === "/api/auth/register" && req.method === "POST") {
    console.log(
      `[SECURITY] Register attempt - IP: ${clientIP}, UserAgent: ${userAgent}, Time: ${timestamp}`
    );
  }

  // Log de operaciones DELETE
  if (req.method === "DELETE") {
    console.log(
      `[SECURITY] DELETE operation - Path: ${req.path}, IP: ${clientIP}, Time: ${timestamp}`
    );
  }

  next();
};

/**
 * Middleware para validar formato de Firebase ID
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const validateFirebaseId = (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const firebaseIdRegex = /^[a-zA-Z0-9]{20,}$/;

    if (!firebaseIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de documento inválido",
      });
    }
  }

  next();
};

module.exports = {
  loginLimiter,
  registerLimiter,
  generalLimiter,
  sanitizeInput,
  securityHeaders,
  securityLogger,
  validateFirebaseId,
};