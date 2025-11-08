/**
 * Constantes globales del sistema
 */

// Roles de usuario
const ROLES = {
  USER: "user",
  PROFESSIONAL: "professional",
};

// Estados de sesión
const SESSION_STATES = {
  OPEN: "sessionStarted",
  CLOSED: "closedSession",
};

// Estados de turnos
const APPOINTMENT_STATES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Colecciones de Firestore
const COLLECTIONS = {
  USERS: "users",
  APPOINTMENTS: "appointments",
  TREATMENTS: "treatments",
};

// Mensajes de error
const ERROR_MESSAGES = {
  // Autenticación
  INVALID_CREDENTIALS: "Credenciales inválidas",
  TOKEN_REQUIRED: "Token de autenticación requerido",
  TOKEN_INVALID: "Token inválido o expirado",
  UNAUTHORIZED: "No autorizado",
  FORBIDDEN: "Acceso prohibido",

  // Usuarios
  USER_NOT_FOUND: "Usuario no encontrado",
  USER_ALREADY_EXISTS: "El usuario ya existe",
  INVALID_EMAIL: "Formato de email inválido",
  WEAK_PASSWORD: "La contraseña debe tener al menos 6 caracteres",
  CANNOT_DELETE_PROFESSIONAL: "No se puede eliminar usuarios profesionales",

  // Turnos
  APPOINTMENT_NOT_FOUND: "Turno no encontrado",
  APPOINTMENT_CONFLICT: "Ya existe un turno en ese horario",
  INVALID_TIME_RANGE: "El horario de finalización debe ser posterior al de inicio",
  INVALID_DATE: "La fecha del turno no es válida",
  APPOINTMENT_IN_PAST: "No se pueden crear turnos en fechas pasadas",

  // Tratamientos
  TREATMENT_NOT_FOUND: "Tratamiento no encontrado",
  TREATMENT_ALREADY_EXISTS: "Ya existe un tratamiento con ese nombre",

  // General
  REQUIRED_FIELDS: "Faltan campos obligatorios",
  INVALID_DATA: "Datos inválidos",
  SERVER_ERROR: "Error interno del servidor",
};

// Mensajes de éxito
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Inicio de sesión exitoso",
  LOGOUT_SUCCESS: "Sesión cerrada correctamente",
  REGISTER_SUCCESS: "Usuario registrado exitosamente",
  USER_CREATED: "Usuario creado exitosamente",
  USER_DELETED: "Usuario eliminado exitosamente",
  APPOINTMENT_CREATED: "Turno creado exitosamente",
  APPOINTMENT_UPDATED: "Turno actualizado exitosamente",
  APPOINTMENT_DELETED: "Turno eliminado exitosamente",
  TREATMENT_CREATED: "Tratamiento creado exitosamente",
  TREATMENT_UPDATED: "Tratamiento actualizado exitosamente",
  TREATMENT_DELETED: "Tratamiento eliminado exitosamente",
};

// Validaciones
const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  FIREBASE_ID_REGEX: /^[a-zA-Z0-9]{20,}$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
};

module.exports = {
  ROLES,
  SESSION_STATES,
  APPOINTMENT_STATES,
  COLLECTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
};