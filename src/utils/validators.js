const { VALIDATION, ERROR_MESSAGES, ROLES } = require("./constants");

/**
 * Validadores de datos del sistema
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {object} { isValid, error }
 */
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "El email es requerido" };
  }

  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
};

/**
 * Valida contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} { isValid, error }
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: "La contraseña es requerida" };
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.WEAK_PASSWORD };
  }

  return { isValid: true };
};

/**
 * Valida rol de usuario
 * @param {string} role - Rol a validar
 * @returns {object} { isValid, error }
 */
const validateRole = (role) => {
  if (!role) {
    return { isValid: false, error: "El rol es requerido" };
  }

  if (!Object.values(ROLES).includes(role)) {
    return {
      isValid: false,
      error: `El rol debe ser '${ROLES.USER}' o '${ROLES.PROFESSIONAL}'`,
    };
  }

  return { isValid: true };
};

/**
 * Valida datos de registro de usuario
 * @param {object} userData - Datos del usuario
 * @returns {object} { isValid, errors }
 */
const validateUserRegistration = (userData) => {
  const errors = [];
  const { name, lastname, email, password, phone, birthdate, role } = userData;

  if (!name || name.trim().length === 0) {
    errors.push("El nombre es requerido");
  }

  if (!lastname || lastname.trim().length === 0) {
    errors.push("El apellido es requerido");
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.error);
  }

  if (!phone || phone.trim().length === 0) {
    errors.push("El teléfono es requerido");
  } else if (!VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push("El formato del teléfono no es válido");
  }

  if (!birthdate) {
    errors.push("La fecha de nacimiento es requerida");
  } else {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
      errors.push("La fecha de nacimiento no es válida");
    }
  }

  if (role) {
    const roleValidation = validateRole(role);
    if (!roleValidation.isValid) {
      errors.push(roleValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de login
 * @param {object} loginData - Datos de login
 * @returns {object} { isValid, errors }
 */
const validateLogin = (loginData) => {
  const errors = [];
  const { email, password } = loginData;

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  if (!password) {
    errors.push("La contraseña es requerida");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de un turno
 * @param {object} appointmentData - Datos del turno
 * @returns {object} { isValid, errors }
 */
const validateAppointment = (appointmentData) => {
  const errors = [];
  const { date, startTime, endTime, userId, treatmentId } = appointmentData;

  if (!date) {
    errors.push("La fecha es requerida");
  } else {
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      errors.push(ERROR_MESSAGES.INVALID_DATE);
    }
  }

  if (!startTime) {
    errors.push("La hora de inicio es requerida");
  }

  if (!endTime) {
    errors.push("La hora de finalización es requerida");
  }

  if (startTime && endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
      errors.push(ERROR_MESSAGES.INVALID_TIME_RANGE);
    }
  }

  if (!userId) {
    errors.push("El paciente es requerido");
  }

  if (!treatmentId) {
    errors.push("El tratamiento es requerido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de un tratamiento
 * @param {object} treatmentData - Datos del tratamiento
 * @returns {object} { isValid, errors }
 */
const validateTreatment = (treatmentData) => {
  const errors = [];
  const { name, description, price, duration } = treatmentData;

  if (!name || name.trim().length === 0) {
    errors.push("El nombre del tratamiento es requerido");
  } else if (name.length > VALIDATION.MAX_NAME_LENGTH) {
    errors.push(
      `El nombre no puede exceder ${VALIDATION.MAX_NAME_LENGTH} caracteres`
    );
  }

  if (!description || description.trim().length === 0) {
    errors.push("La descripción es requerida");
  } else if (description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.push(
      `La descripción no puede exceder ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
    );
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push("El precio debe ser un número mayor a 0");
  }

  if (duration && (isNaN(duration) || duration <= 0)) {
    errors.push("La duración debe ser un número mayor a 0 (en minutos)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida ID de Firebase
 * @param {string} id - ID a validar
 * @returns {object} { isValid, error }
 */
const validateFirebaseId = (id) => {
  if (!id) {
    return { isValid: false, error: "El ID es requerido" };
  }

  if (!VALIDATION.FIREBASE_ID_REGEX.test(id)) {
    return { isValid: false, error: "ID de documento inválido" };
  }

  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRole,
  validateUserRegistration,
  validateLogin,
  validateAppointment,
  validateTreatment,
  validateFirebaseId,
};