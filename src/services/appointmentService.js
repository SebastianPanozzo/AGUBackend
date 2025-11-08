const AppointmentModel = require("../models/appointmentModel");
const UserModel = require("../models/userModel");
const TreatmentModel = require("../models/treatmentModel");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APPOINTMENT_STATES,
} = require("../utils/constants");
const { validateAppointment, validateFirebaseId } = require("../utils/validators");
const { isDateInPast, isEndTimeAfterStart } = require("../utils/helpers");

/**
 * Servicio de Turnos
 * Contiene la lógica de negocio para gestión de turnos
 */
class AppointmentService {
  /**
   * Obtener todos los turnos
   * @returns {Promise<Array>} Lista de turnos
   */
  static async getAllAppointments() {
    return await AppointmentModel.getAll();
  }

  /**
   * Obtener un turno por ID
   * @param {string} appointmentId - ID del turno
   * @returns {Promise<object>} Turno encontrado
   */
  static async getAppointmentById(appointmentId) {
    const validation = validateFirebaseId(appointmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    const appointment = await AppointmentModel.getById(appointmentId);

    if (!appointment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      };
    }

    return appointment;
  }

  /**
   * Obtener turnos de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de turnos del usuario
   */
  static async getAppointmentsByUser(userId) {
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

    return await AppointmentModel.getByUserId(userId);
  }

  /**
   * Obtener turnos por fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de turnos
   */
  static async getAppointmentsByDate(date) {
    return await AppointmentModel.getByDate(date);
  }

  /**
   * Crear un nuevo turno
   * @param {object} appointmentData - Datos del turno
   * @returns {Promise<object>} Turno creado
   */
  static async createAppointment(appointmentData) {
    // Validar datos
    const validation = validateAppointment(appointmentData);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_DATA,
        errors: validation.errors,
      };
    }

    const { date, startTime, endTime, userId, treatmentId } = appointmentData;

    // Verificar que la fecha no esté en el pasado
    if (isDateInPast(date)) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.APPOINTMENT_IN_PAST,
      };
    }

    // Verificar que el horario de fin sea posterior al de inicio
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (!isEndTimeAfterStart(startDateTime, endDateTime)) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_TIME_RANGE,
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

    // Verificar que el tratamiento existe
    const treatment = await TreatmentModel.getById(treatmentId);
    if (!treatment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.TREATMENT_NOT_FOUND,
      };
    }

    // Verificar conflictos de horario
    const hasConflict = await AppointmentModel.hasTimeConflict(
      date,
      startTime,
      endTime
    );

    if (hasConflict) {
      throw {
        statusCode: 409,
        message: ERROR_MESSAGES.APPOINTMENT_CONFLICT,
      };
    }

    // Crear turno
    const newAppointment = await AppointmentModel.create(appointmentData);

    return {
      message: SUCCESS_MESSAGES.APPOINTMENT_CREATED,
      appointment: newAppointment,
    };
  }

  /**
   * Actualizar un turno
   * @param {string} appointmentId - ID del turno
   * @param {object} appointmentData - Datos a actualizar
   * @returns {Promise<object>} Turno actualizado
   */
  static async updateAppointment(appointmentId, appointmentData) {
    const validation = validateFirebaseId(appointmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    // Verificar que el turno existe
    const existingAppointment = await AppointmentModel.getById(appointmentId);
    if (!existingAppointment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      };
    }

    // Si se están actualizando fecha y/u horarios, verificar conflictos
    if (
      appointmentData.date ||
      appointmentData.startTime ||
      appointmentData.endTime
    ) {
      const date = appointmentData.date || existingAppointment.date;
      const startTime =
        appointmentData.startTime || existingAppointment.startTime;
      const endTime = appointmentData.endTime || existingAppointment.endTime;

      // Verificar que el horario de fin sea posterior al de inicio
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (!isEndTimeAfterStart(startDateTime, endDateTime)) {
        throw {
          statusCode: 400,
          message: ERROR_MESSAGES.INVALID_TIME_RANGE,
        };
      }

      // Verificar conflictos (excluyendo el turno actual)
      const hasConflict = await AppointmentModel.hasTimeConflict(
        date,
        startTime,
        endTime,
        appointmentId
      );

      if (hasConflict) {
        throw {
          statusCode: 409,
          message: ERROR_MESSAGES.APPOINTMENT_CONFLICT,
        };
      }
    }

    // Si se actualiza el tratamiento, verificar que existe
    if (appointmentData.treatmentId) {
      const treatment = await TreatmentModel.getById(
        appointmentData.treatmentId
      );
      if (!treatment) {
        throw {
          statusCode: 404,
          message: ERROR_MESSAGES.TREATMENT_NOT_FOUND,
        };
      }
    }

    // Actualizar turno
    const updatedAppointment = await AppointmentModel.update(
      appointmentId,
      appointmentData
    );

    return {
      message: SUCCESS_MESSAGES.APPOINTMENT_UPDATED,
      appointment: updatedAppointment,
    };
  }

  /**
   * Eliminar un turno
   * @param {string} appointmentId - ID del turno
   * @returns {Promise<object>} Resultado de la eliminación
   */
  static async deleteAppointment(appointmentId) {
    const validation = validateFirebaseId(appointmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    // Verificar que el turno existe
    const appointment = await AppointmentModel.getById(appointmentId);
    if (!appointment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      };
    }

    // Eliminar turno
    await AppointmentModel.delete(appointmentId);

    return {
      message: SUCCESS_MESSAGES.APPOINTMENT_DELETED,
    };
  }

  /**
   * Cambiar estado de un turno
   * @param {string} appointmentId - ID del turno
   * @param {string} state - Nuevo estado
   * @returns {Promise<object>} Turno actualizado
   */
  static async updateAppointmentState(appointmentId, state) {
    const validation = validateFirebaseId(appointmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    // Validar estado
    if (!Object.values(APPOINTMENT_STATES).includes(state)) {
      throw {
        statusCode: 400,
        message: "Estado de turno inválido",
      };
    }

    // Verificar que el turno existe
    const appointment = await AppointmentModel.getById(appointmentId);
    if (!appointment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      };
    }

    // Actualizar estado
    const updatedAppointment = await AppointmentModel.updateState(
      appointmentId,
      state
    );

    return {
      message: SUCCESS_MESSAGES.APPOINTMENT_UPDATED,
      appointment: updatedAppointment,
    };
  }
}

module.exports = AppointmentService;