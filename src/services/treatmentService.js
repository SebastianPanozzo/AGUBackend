const TreatmentModel = require("../models/treatmentModel");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants");
const { validateTreatment, validateFirebaseId } = require("../utils/validators");

/**
 * Servicio de Tratamientos
 * Contiene la lógica de negocio para gestión de tratamientos
 */
class TreatmentService {
  /**
   * Obtener todos los tratamientos
   * @returns {Promise<Array>} Lista de tratamientos
   */
  static async getAllTreatments() {
    return await TreatmentModel.getAll();
  }

  /**
   * Obtener un tratamiento por ID
   * @param {string} treatmentId - ID del tratamiento
   * @returns {Promise<object>} Tratamiento encontrado
   */
  static async getTreatmentById(treatmentId) {
    const validation = validateFirebaseId(treatmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    const treatment = await TreatmentModel.getById(treatmentId);

    if (!treatment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.TREATMENT_NOT_FOUND,
      };
    }

    return treatment;
  }

  /**
   * Crear un nuevo tratamiento
   * @param {object} treatmentData - Datos del tratamiento
   * @returns {Promise<object>} Tratamiento creado
   */
  static async createTreatment(treatmentData) {
    // Validar datos
    const validation = validateTreatment(treatmentData);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_DATA,
        errors: validation.errors,
      };
    }

    // Verificar que no exista un tratamiento con el mismo nombre
    const existingTreatment = await TreatmentModel.getByName(
      treatmentData.name
    );

    if (existingTreatment) {
      throw {
        statusCode: 409,
        message: ERROR_MESSAGES.TREATMENT_ALREADY_EXISTS,
      };
    }

    // Crear tratamiento
    const newTreatment = await TreatmentModel.create(treatmentData);

    return {
      message: SUCCESS_MESSAGES.TREATMENT_CREATED,
      treatment: newTreatment,
    };
  }

  /**
   * Actualizar un tratamiento
   * @param {string} treatmentId - ID del tratamiento
   * @param {object} treatmentData - Datos a actualizar
   * @returns {Promise<object>} Tratamiento actualizado
   */
  static async updateTreatment(treatmentId, treatmentData) {
    const validation = validateFirebaseId(treatmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
      };
    }

    // Verificar que el tratamiento existe
    const existingTreatment = await TreatmentModel.getById(treatmentId);
    if (!existingTreatment) {
      throw {
        statusCode: 404,
        message: ERROR_MESSAGES.TREATMENT_NOT_FOUND,
      };
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (treatmentData.name) {
      const treatmentWithSameName = await TreatmentModel.getByName(
        treatmentData.name
      );

      if (
        treatmentWithSameName &&
        treatmentWithSameName.id !== treatmentId
      ) {
        throw {
          statusCode: 409,
          message: ERROR_MESSAGES.TREATMENT_ALREADY_EXISTS,
        };
      }
    }

    // Validar campos si se proporcionan
    if (Object.keys(treatmentData).length > 0) {
      const dataToValidate = {
        name: treatmentData.name || existingTreatment.name,
        description:
          treatmentData.description || existingTreatment.description,
        price: treatmentData.price || existingTreatment.price,
        duration: treatmentData.duration || existingTreatment.duration,
      };

      const validationResult = validateTreatment(dataToValidate);
      if (!validationResult.isValid) {
        throw {
          statusCode: 400,
          message: ERROR_MESSAGES.INVALID_DATA,
          errors: validationResult.errors,
        };
      }
    }

    // Actualizar tratamiento
    const updatedTreatment = await TreatmentModel.update(
      treatmentId,
      treatmentData
    );

    return {
      message: SUCCESS_MESSAGES.TREATMENT_UPDATED,
      treatment: updatedTreatment,
    };
  }

  /**
   * Eliminar un tratamiento
   * @param {string} treatmentId - ID del tratamiento
   * @returns {Promise<object>} Resultado de la eliminación
   */
  static async deleteTreatment(treatmentId) {
    const validation = validateFirebaseId(treatmentId);
    if (!validation.isValid) {
      throw {
        statusCode: 400,
        message: validation.error,
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

    // Eliminar tratamiento
    await TreatmentModel.delete(treatmentId);

    return {
      message: SUCCESS_MESSAGES.TREATMENT_DELETED,
    };
  }
}

module.exports = TreatmentService;