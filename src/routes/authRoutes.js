const express = require("express");
const AuthController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  loginLimiter,
  registerLimiter,
} = require("../middlewares/security");

const router = express.Router();

/**
 * Rutas de Autenticación
 * Prefijo: /api/auth
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post("/register", registerLimiter, AuthController.register);

// POST /api/auth/login - Iniciar sesión
router.post("/login", loginLimiter, AuthController.login);

// POST /api/auth/logout - Cerrar sesión (requiere autenticación)
router.post("/logout", verifyToken, AuthController.logout);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get("/profile", verifyToken, AuthController.getProfile);

// GET /api/auth/verify - Verificar si el token es válido
router.get("/verify", verifyToken, AuthController.verifyToken);

module.exports = router;