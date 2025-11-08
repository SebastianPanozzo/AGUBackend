const AuthService = require("../services/authService");
const { buildResponse } = require("../utils/helpers");

/**
 * Controlador de Autenticación
 * Maneja las peticiones HTTP relacionadas con autenticación
 */
class AuthController {
  /**
   * Registrar un nuevo usuario
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Iniciar sesión
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cerrar sesión
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await AuthService.logout(userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/auth/profile
   */
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await AuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verificar token
   * GET /api/auth/verify
   */
  static async verifyToken(req, res, next) {
    try {
      // Si llegamos aquí, el token es válido (verificado por middleware)
      res.status(200).json({
        success: true,
        message: "Token válido",
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;