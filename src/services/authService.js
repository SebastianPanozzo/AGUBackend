const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SESSION_STATES,
} = require("../utils/constants");
const {
  validateLogin,
  validateUserRegistration,
} = require("../utils/validators");

/**
 * Servicio de Autenticación
 * Contiene la lógica de negocio para login, registro y gestión de tokens
 */
class AuthService {
  /**
   * Generar token JWT
   * @param {object} payload - Datos a incluir en el token
   * @returns {string} Token JWT
   */
  static generateToken(payload) {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  /**
   * Registrar un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<object>} Resultado del registro
   */
  static async register(userData) {
    // Validar datos
    const validation = validateUserRegistration(userData);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_DATA,
        errors: validation.errors,
      };
    }

    // Verificar si el email ya existe
    const existingUser = await UserModel.getByEmail(userData.email);
    if (existingUser) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
      };
    }

    // Crear usuario
    const newUser = await UserModel.create(userData);

    // Generar token
    const token = this.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      user: newUser,
      token,
    };
  }

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<object>} Resultado del login
   */
  static async login(email, password) {
    // Validar datos
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_DATA,
        errors: validation.errors,
      };
    }

    // Validar credenciales
    const user = await UserModel.validatePassword(email, password);
    if (!user) {
      throw {
        statusCode: 401,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      };
    }

    // Actualizar estado de sesión
    await UserModel.updateSessionState(user.id, SESSION_STATES.OPEN);

    // Generar token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        ...user,
        state: SESSION_STATES.OPEN,
      },
      token,
    };
  }

  /**
   * Cerrar sesión
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>} Resultado del logout
   */
  static async logout(userId) {
    // Verificar que el usuario existe
    const user = await UserModel.getById(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Actualizar estado de sesión
    await UserModel.updateSessionState(userId, SESSION_STATES.CLOSED);

    return {
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token a verificar
   * @returns {object} Datos decodificados del token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw {
        statusCode: 401,
        message: ERROR_MESSAGES.TOKEN_INVALID,
      };
    }
  }

  /**
   * Obtener perfil de usuario autenticado
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>} Datos del usuario
   */
  static async getProfile(userId) {
    const user = await UserModel.getById(userId);

    if (!user) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    return user;
  }
}

module.exports = AuthService;