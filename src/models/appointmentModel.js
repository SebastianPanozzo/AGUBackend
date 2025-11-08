const { db } = require("../config/firebase");
const { COLLECTIONS, APPOINTMENT_STATES } = require("../utils/constants");
const { getDateOnly } = require("../utils/helpers");

/**
 * Modelo de Turnos
 * Gestiona todas las operaciones CRUD con la colección de turnos en Firestore
 */
class AppointmentModel {
  static collectionName = COLLECTIONS.APPOINTMENTS;

  /**
   * Obtener todos los turnos
   * @returns {Promise<Array>} Lista de turnos
   */
  static async getAll() {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .orderBy("date", "desc")
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error al obtener turnos: ${error.message}`);
    }
  }

  /**
   * Obtener un turno por ID
   * @param {string} id - ID del turno
   * @returns {Promise<object|null>} Turno encontrado o null
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
      throw new Error(`Error al obtener turno: ${error.message}`);
    }
  }

  /**
   * Obtener turnos por usuario (paciente)
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de turnos del usuario
   */
  static async getByUserId(userId) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(
        `Error al obtener turnos del usuario: ${error.message}`
      );
    }
  }

  /**
   * Obtener turnos por fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de turnos de esa fecha
   */
  static async getByDate(date) {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("date", "==", date)
        .orderBy("startTime", "asc")
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error al obtener turnos por fecha: ${error.message}`);
    }
  }

  /**
   * Verificar si existe conflicto de horarios
   * @param {string} date - Fecha del turno
   * @param {string} startTime - Hora de inicio
   * @param {string} endTime - Hora de finalización
   * @param {string} excludeId - ID de turno a excluir (para actualizaciones)
   * @returns {Promise<boolean>} true si hay conflicto
   */
  static async hasTimeConflict(date, startTime, endTime, excludeId = null) {
    try {
      const appointmentsOnDate = await this.getByDate(date);

      const newStart = new Date(`${date}T${startTime}`);
      const newEnd = new Date(`${date}T${endTime}`);

      for (const appointment of appointmentsOnDate) {
        // Excluir el turno actual si estamos actualizando
        if (excludeId && appointment.id === excludeId) {
          continue;
        }

        // Solo verificar turnos no cancelados
        if (appointment.state === APPOINTMENT_STATES.CANCELLED) {
          continue;
        }

        const existingStart = new Date(`${date}T${appointment.startTime}`);
        const existingEnd = new Date(`${date}T${appointment.endTime}`);

        // Verificar solapamiento
        if (newStart < existingEnd && existingStart < newEnd) {
          return true;
        }
      }

      return false;
    } catch (error) {
      throw new Error(
        `Error al verificar conflicto de horarios: ${error.message}`
      );
    }
  }

  /**
   * Crear un nuevo turno
   * @param {object} appointmentData - Datos del turno
   * @returns {Promise<object>} Turno creado
   */
  static async create(appointmentData) {
    try {
      const { date, startTime, endTime, userId, treatmentId, notes } =
        appointmentData;

      const newAppointment = {
        date: getDateOnly(date),
        startTime,
        endTime,
        userId,
        treatmentId,
        notes: notes || "",
        state: APPOINTMENT_STATES.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db
        .collection(this.collectionName)
        .add(newAppointment);

      return {
        id: docRef.id,
        ...newAppointment,
      };
    } catch (error) {
      throw new Error(`Error al crear turno: ${error.message}`);
    }
  }

  /**
   * Actualizar un turno
   * @param {string} id - ID del turno
   * @param {object} appointmentData - Datos a actualizar
   * @returns {Promise<object>} Turno actualizado
   */
  static async update(id, appointmentData) {
    try {
      const updateData = {
        updatedAt: new Date(),
      };

      if (appointmentData.date !== undefined) {
        updateData.date = getDateOnly(appointmentData.date);
      }

      if (appointmentData.startTime !== undefined) {
        updateData.startTime = appointmentData.startTime;
      }

      if (appointmentData.endTime !== undefined) {
        updateData.endTime = appointmentData.endTime;
      }

      if (appointmentData.treatmentId !== undefined) {
        updateData.treatmentId = appointmentData.treatmentId;
      }

      if (appointmentData.notes !== undefined) {
        updateData.notes = appointmentData.notes;
      }

      if (appointmentData.state !== undefined) {
        updateData.state = appointmentData.state;
      }

      await db.collection(this.collectionName).doc(id).update(updateData);

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar turno: ${error.message}`);
    }
  }

  /**
   * Eliminar un turno
   * @param {string} id - ID del turno
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async delete(id) {
    try {
      await db.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar turno: ${error.message}`);
    }
  }

  /**
   * Cambiar estado de un turno
   * @param {string} id - ID del turno
   * @param {string} state - Nuevo estado
   * @returns {Promise<object>} Turno actualizado
   */
  static async updateState(id, state) {
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
      throw new Error(`Error al actualizar estado del turno: ${error.message}`);
    }
  }
}

module.exports = AppointmentModel;