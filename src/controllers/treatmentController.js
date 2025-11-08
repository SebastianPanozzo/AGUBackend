const TreatmentService = require("../services/treatmentService");

/**
 * Controlador de Tratamientos
 * Maneja las peticiones HTTP relacionadas con tratamientos
 */
class TreatmentController {
  /**
   * Obtener todos los tratamientos
   * GET /api/treatments
   */
  static async getAllTreatments(req, res, next) {
    try {
      const treatments = await TreatmentService.getAllTreatments();

      res.status(200).json({
        success: true,
        data: treatments,
        count: treatments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un tratamiento por ID
   * GET /api/treatments/:id
   */
  static async getTreatmentById(req, res, next) {
    try {
      const { id } = req.params;
      const treatment = await TreatmentService.getTreatmentById(id);

      res.status(200).json({
        success: true,
        data: treatment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear un nuevo tratamiento
   * POST /api/treatments
   */
  static async createTreatment(req, res, next) {
    try {
      const result = await TreatmentService.createTreatment(req.body);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar un tratamiento
   * PUT /api/treatments/:id
   */
  static async updateTreatment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await TreatmentService.updateTreatment(id, req.body);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un tratamiento
   * DELETE /api/treatments/:id
   */
  static async deleteTreatment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await TreatmentService.deleteTreatment(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TreatmentController;