const express = require("express");
const AppointmentController = require("../controllers/appointmentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireProfessional, requireAnyRole } = require("../middlewares/roleMiddleware");
const { validateFirebaseId } = require("../middlewares/security");

const router = express.Router();

/**
 * Rutas de Turnos
 * Prefijo: /api/appointments
 */

// Middleware global - todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/appointments - Obtener todos los turnos (solo profesionales)
router.get("/", requireProfessional, AppointmentController.getAllAppointments);

// GET /api/appointments/date/:date - Obtener turnos por fecha (solo profesionales)
router.get(
  "/date/:date",
  requireProfessional,
  AppointmentController.getAppointmentsByDate
);

// GET /api/appointments/user/:userId - Obtener turnos de un usuario
// Los usuarios pueden ver solo sus propios turnos, los profesionales pueden ver todos
router.get(
  "/user/:userId",
  validateFirebaseId,
  requireAnyRole,
  AppointmentController.getAppointmentsByUser
);

// GET /api/appointments/:id - Obtener un turno por ID
router.get(
  "/:id",
  validateFirebaseId,
  requireAnyRole,
  AppointmentController.getAppointmentById
);

// POST /api/appointments - Crear un nuevo turno (solo profesionales)
router.post("/", requireProfessional, AppointmentController.createAppointment);

// PUT /api/appointments/:id - Actualizar un turno (solo profesionales)
router.put(
  "/:id",
  validateFirebaseId,
  requireProfessional,
  AppointmentController.updateAppointment
);

// PATCH /api/appointments/:id/state - Cambiar estado de un turno (solo profesionales)
router.patch(
  "/:id/state",
  validateFirebaseId,
  requireProfessional,
  AppointmentController.updateAppointmentState
);

// DELETE /api/appointments/:id - Eliminar un turno (solo profesionales)
router.delete(
  "/:id",
  validateFirebaseId,
  requireProfessional,
  AppointmentController.deleteAppointment
);

module.exports = router;