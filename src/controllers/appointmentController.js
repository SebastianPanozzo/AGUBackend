const AppointmentService = require("../services/appointmentService");

/**
 * Controlador de Turnos
 * Maneja las peticiones HTTP relacionadas con turnos
 */
class AppointmentController {
  /**
   * Obtener todos los turnos
   * GET /api/appointments
   */
  static async getAllAppointments(req, res, next) {
    try {
      const appointments = await AppointmentService.getAllAppointments();

      res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un turno por ID
   * GET /api/appointments/:id
   */
  static async getAppointmentById(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.getAppointmentById(id);

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener turnos de un usuario
   * GET /api/appointments/user/:userId
   */
  static async getAppointmentsByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const appointments = await AppointmentService.getAppointmentsByUser(
        userId
      );

      res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener turnos por fecha
   * GET /api/appointments/date/:date
   */
  static async getAppointmentsByDate(req, res, next) {
    try {
      const { date } = req.params;
      const appointments = await AppointmentService.getAppointmentsByDate(date);

      res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear un nuevo turno
   * POST /api/appointments
   */
  static async createAppointment(req, res, next) {
    try {
      const result = await AppointmentService.createAppointment(req.body);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar un turno
   * PUT /api/appointments/:id
   */
  static async updateAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AppointmentService.updateAppointment(id, req.body);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un turno
   * DELETE /api/appointments/:id
   */
  static async deleteAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AppointmentService.deleteAppointment(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cambiar estado de un turno
   * PATCH /api/appointments/:id/state
   */
  static async updateAppointmentState(req, res, next) {
    try {
      const { id } = req.params;
      const { state } = req.body;
      const result = await AppointmentService.updateAppointmentState(
        id,
        state
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppointmentController;