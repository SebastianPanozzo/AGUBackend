// src/models/serviceModel.js
const { db } = require("../config/firebase");
const { COLLECTIONS } = require("../utils/constants");

/**
 * Modelo de Tratamientos
 * Gestiona todas las operaciones CRUD con la colección de tratamientos en Firestore
 */
class TreatmentModel {
  static collectionName = COLLECTIONS.TREATMENTS;

  /**
   * Obtener todos los tratamientos
   * @returns {Promise<Array>} Lista de tratamientos
   */
  static async getAll() {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .orderBy("name", "asc")
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error al obtener tratamientos: ${error.message}`);
    }
  }

  /**
   * Obtener un tratamiento por ID
   * @param {string} id - ID del tratamiento
   * @returns {Promise<object|null>} Tratamiento encontrado o null
   */
  static async getById(id) {
    try {
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(`Error al obtener tratamiento: ${error.message}`);
    }
  }

  /**
   * Obtener tratamiento por nombre
   * @param {string} name - Nombre del tratamiento
   * @returns {Promise<object|null>} Tratamiento encontrado o null
   */
  static async getByName(name) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("name", "==", name.trim())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(
        `Error al obtener tratamiento por nombre: ${error.message}`
      );
    }
  }

  /**
   * Crear un nuevo tratamiento
   * @param {object} treatmentData - Datos del tratamiento
   * @returns {Promise<object>} Tratamiento creado
   */
  static async create(treatmentData) {
    try {
      const { name, description, price, duration, image } = treatmentData;

      const newTreatment = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : null,
        image: image ? image.trim() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db
        .collection(this.collectionName)
        .add(newTreatment);

      return {
        id: docRef.id,
        ...newTreatment,
      };
    } catch (error) {
      throw new Error(`Error al crear tratamiento: ${error.message}`);
    }
  }

  /**
   * Actualizar un tratamiento
   * @param {string} id - ID del tratamiento
   * @param {object} treatmentData - Datos a actualizar
   * @returns {Promise<object>} Tratamiento actualizado
   */
  static async update(id, treatmentData) {
    try {
      const updateData = {
        updatedAt: new Date(),
      };

      if (treatmentData.name !== undefined) {
        updateData.name = treatmentData.name.trim();
      }

      if (treatmentData.description !== undefined) {
        updateData.description = treatmentData.description.trim();
      }

      if (treatmentData.price !== undefined) {
        updateData.price = parseFloat(treatmentData.price);
      }

      if (treatmentData.duration !== undefined) {
        updateData.duration = treatmentData.duration
          ? parseInt(treatmentData.duration)
          : null;
      }

      if (treatmentData.image !== undefined) {
        updateData.image = treatmentData.image
          ? treatmentData.image.trim()
          : null;
      }

      await db.collection(this.collectionName).doc(id).update(updateData);

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar tratamiento: ${error.message}`);
    }
  }

  /**
   * Eliminar un tratamiento
   * @param {string} id - ID del tratamiento
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async delete(id) {
    try {
      await db.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar tratamiento: ${error.message}`);
    }
  }
}

module.exports = TreatmentModel;