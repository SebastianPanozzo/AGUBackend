const express = require("express");
const UserController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireProfessional } = require("../middlewares/roleMiddleware");
const { validateFirebaseId } = require("../middlewares/security");

const router = express.Router();

/**
 * Rutas de Usuarios
 * Prefijo: /api/users
 * Todas las rutas requieren autenticación y rol profesional
 */

// Middleware global para todas las rutas de usuarios
router.use(verifyToken);
router.use(requireProfessional);

// GET /api/users - Obtener todos los usuarios
router.get("/", UserController.getAllUsers);

// GET /api/users/active - Obtener usuarios activos
router.get("/active", UserController.getActiveUsers);

// GET /api/users/role/:role - Obtener usuarios por rol
router.get("/role/:role", UserController.getUsersByRole);

// GET /api/users/:id - Obtener un usuario por ID
router.get("/:id", validateFirebaseId, UserController.getUserById);

// DELETE /api/users/:id - Eliminar un usuario
router.delete("/:id", validateFirebaseId, UserController.deleteUser);

module.exports = router;