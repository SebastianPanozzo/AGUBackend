const express = require("express");
const TreatmentController = require("../controllers/treatmentController");
const { verifyToken, optionalAuth } = require("../middlewares/authMiddleware");
const { requireProfessional } = require("../middlewares/roleMiddleware");
const { validateFirebaseId } = require("../middlewares/security");

const router = express.Router();

/**
 * Rutas de Tratamientos
 * Prefijo: /api/treatments
 */

// GET /api/treatments - Obtener todos los tratamientos (público o autenticado)
router.get("/", optionalAuth, TreatmentController.getAllTreatments);

// GET /api/treatments/:id - Obtener un tratamiento por ID (público o autenticado)
router.get(
  "/:id",
  validateFirebaseId,
  optionalAuth,
  TreatmentController.getTreatmentById
);

// POST /api/treatments - Crear un nuevo tratamiento (solo profesionales)
router.post(
  "/",
  verifyToken,
  requireProfessional,
  TreatmentController.createTreatment
);

// PUT /api/treatments/:id - Actualizar un tratamiento (solo profesionales)
router.put(
  "/:id",
  validateFirebaseId,
  verifyToken,
  requireProfessional,
  TreatmentController.updateTreatment
);

// DELETE /api/treatments/:id - Eliminar un tratamiento (solo profesionales)
router.delete(
  "/:id",
  validateFirebaseId,
  verifyToken,
  requireProfessional,
  TreatmentController.deleteTreatment
);

module.exports = router;