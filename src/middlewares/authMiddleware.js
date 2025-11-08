const jwt = require("jsonwebtoken");
const { ERROR_MESSAGES } = require("../utils/constants");

/**
 * Middleware de Autenticación
 * Verifica y valida tokens JWT en las peticiones
 */

/**
 * Verificar token JWT en las peticiones
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_REQUIRED,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_REQUIRED,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expirado",
        });
      }

      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Agrega información del usuario si hay token, pero no bloquea si no hay
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (jwtError) {
        // Token inválido o expirado, pero no bloqueamos la petición
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  verifyToken,
  optionalAuth,
};