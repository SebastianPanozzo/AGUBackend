const UserModel = require("../models/userModel");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROLES,
} = require("../utils/constants");
const { validateFirebaseId } = require("../utils/validators");

/**
 * Servicio de Usuarios
 * Contiene la lógica de negocio para gestión de usuarios
 */
class UserService {
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async getAllUsers() {
    return await UserModel.getAll();
  }

  /**
   * Obtener un usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>} Usuario encontrado
   */
  static async getUserById(userId) {
    // Validar ID
    const validation = validateFirebaseId(userId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    const user = await UserModel.getById(userId);

    if (!user) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    return user;
  }

  /**
   * Obtener usuarios por rol
   * @param {string} role - Rol a filtrar
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async getUsersByRole(role) {
    if (!Object.values(ROLES).includes(role)) {
      throw {
        statusCode: 400,
        message: `El rol debe ser '${ROLES.USER}' o '${ROLES.PROFESSIONAL}'`,
      };
    }

    return await UserModel.getByRole(role);
  }

  /**
   * Eliminar un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>} Resultado de la eliminación
   */
  static async deleteUser(userId) {
    // Validar ID
    const validation = validateFirebaseId(userId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    // Verificar que el usuario existe
    const user = await UserModel.getById(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Verificar que no sea un profesional
    if (user.role === ROLES.PROFESSIONAL) {
      throw {
        statusCode: 403,
        message: ERROR_MESSAGES.CANNOT_DELETE_PROFESSIONAL,
      };
    }

    // Eliminar usuario
    await UserModel.delete(userId);

    return {
      message: SUCCESS_MESSAGES.USER_DELETED,
    };
  }

  /**
   * Obtener usuarios activos (sesión abierta)
   * @returns {Promise<Array>} Lista de usuarios activos
   */
  static async getActiveUsers() {
    return await UserModel.getBySessionState("sessionStarted");
  }
}

module.exports = UserService;