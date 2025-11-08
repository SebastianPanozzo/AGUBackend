const UserService = require("../services/userService");

/**
 * Controlador de Usuarios
 * Maneja las peticiones HTTP relacionadas con usuarios
 */
class UserController {
  /**
   * Obtener todos los usuarios
   * GET /api/users
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un usuario por ID
   * GET /api/users/:id
   */
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener usuarios por rol
   * GET /api/users/role/:role
   */
  static async getUsersByRole(req, res, next) {
    try {
      const { role } = req.params;
      const users = await UserService.getUsersByRole(role);

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un usuario
   * DELETE /api/users/:id
   */
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener usuarios activos
   * GET /api/users/active
   */
  static async getActiveUsers(req, res, next) {
    try {
      const users = await UserService.getActiveUsers();

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;