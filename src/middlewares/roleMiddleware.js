const { ERROR_MESSAGES, ROLES } = require("../utils/constants");

/**
 * Middleware de Verificación de Roles
 * Controla el acceso basado en roles de usuario
 */

/**
 * Verificar que el usuario tenga uno de los roles permitidos
 * @param {...string} allowedRoles - Roles permitidos
 * @returns {function} Middleware function
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
};

/**
 * Middleware para requerir rol profesional
 */
const requireProfessional = requireRole(ROLES.PROFESSIONAL);

/**
 * Middleware para requerir rol de usuario
 */
const requireUser = requireRole(ROLES.USER);

/**
 * Middleware para permitir ambos roles
 */
const requireAnyRole = requireRole(ROLES.USER, ROLES.PROFESSIONAL);

module.exports = {
  requireRole,
  requireProfessional,
  requireUser,
  requireAnyRole,
};