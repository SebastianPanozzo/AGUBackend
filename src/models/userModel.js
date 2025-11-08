// src/models/userModel.js
const { db } = require("../config/firebase");
const bcrypt = require("bcryptjs");
const { COLLECTIONS, SESSION_STATES } = require("../utils/constants");
const { excludeFields } = require("../utils/helpers");

/**
 * Modelo de Usuario
 * Gestiona todas las operaciones CRUD con la colección de usuarios en Firestore
 */
class UserModel {
  static collectionName = COLLECTIONS.USERS;

  /**
   * Convierte los Timestamps de Firestore a formato ISO string
   * @param {object} userData - Datos del usuario desde Firestore
   * @returns {object} Usuario con fechas convertidas
   */
  static convertTimestamps(userData) {
    const converted = { ...userData };
    
    // Convertir birthdate si existe y es un Timestamp
    if (converted.birthdate && converted.birthdate.toDate) {
      converted.birthdate = converted.birthdate.toDate().toISOString();
    }
    
    // Convertir createdAt si existe y es un Timestamp
    if (converted.createdAt && converted.createdAt.toDate) {
      converted.createdAt = converted.createdAt.toDate().toISOString();
    }
    
    // Convertir updatedAt si existe y es un Timestamp
    if (converted.updatedAt && converted.updatedAt.toDate) {
      converted.updatedAt = converted.updatedAt.toDate().toISOString();
    }
    
    return converted;
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async getAll() {
    try {
      const snapshot = await db.collection(this.collectionName).get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const userData = this.convertTimestamps(doc.data());
        return excludeFields({ id: doc.id, ...userData }, ["password"]);
      });
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<object|null>} Usuario encontrado o null
   */
  static async getById(id) {
    try {
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const userData = this.convertTimestamps(doc.data());
      return excludeFields({ id: doc.id, ...userData }, ["password"]);
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener usuario por email (incluye password para login)
   * @param {string} email - Email del usuario
   * @returns {Promise<object|null>} Usuario encontrado o null
   */
  static async getByEmail(email) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = this.convertTimestamps(doc.data());
      
      return {
        id: doc.id,
        ...userData,
      };
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<object>} Usuario creado
   */
  static async create(userData) {
    try {
      const { name, lastname, email, password, phone, birthdate, role } =
        userData;

      // Hashear contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Convertir la fecha de nacimiento a Timestamp de Firestore
      const birthdateTimestamp = new Date(birthdate);

      const newUser = {
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone.trim(),
        birthdate: birthdateTimestamp,
        role: role || "user",
        state: SESSION_STATES.CLOSED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection(this.collectionName).add(newUser);

      // Obtener el usuario creado con las fechas convertidas
      const createdUser = this.convertTimestamps(newUser);
      
      return excludeFields(
        {
          id: docRef.id,
          ...createdUser,
        },
        ["password"]
      );
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar estado de sesión del usuario
   * @param {string} id - ID del usuario
   * @param {string} state - Nuevo estado
   * @returns {Promise<object>} Usuario actualizado
   */
  static async updateSessionState(id, state) {
    try {
      await db
        .collection(this.collectionName)
        .doc(id)
        .update({
          state: state,
          updatedAt: new Date(),
        });

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar estado de sesión: ${error.message}`);
    }
  }

  /**
   * Eliminar un usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async delete(id) {
    try {
      await db.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Validar contraseña de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña a validar
   * @returns {Promise<object|null>} Usuario si es válido, null si no
   */
  static async validatePassword(email, password) {
    try {
      const user = await this.getByEmail(email);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return null;
      }

      return excludeFields(user, ["password"]);
    } catch (error) {
      throw new Error(`Error al validar contraseña: ${error.message}`);
    }
  }

  /**
   * Obtener usuarios por rol
   * @param {string} role - Rol a buscar
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async getByRole(role) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("role", "==", role)
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const userData = this.convertTimestamps(doc.data());
        return excludeFields({ id: doc.id, ...userData }, ["password"]);
      });
    } catch (error) {
      throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
    }
  }

  /**
   * Obtener usuarios por estado de sesión
   * @param {string} state - Estado de sesión
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async getBySessionState(state) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("state", "==", state)
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const userData = this.convertTimestamps(doc.data());
        return excludeFields({ id: doc.id, ...userData }, ["password"]);
      });
    } catch (error) {
      throw new Error(`Error al obtener usuarios por estado: ${error.message}`);
    }
  }
}

module.exports = UserModel;