/**
 * Funciones auxiliares reutilizables
 */

/**
 * Formatea una fecha a string legible
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDate = (date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Formatea una hora a string HH:MM
 * @param {Date} date - Fecha con hora
 * @returns {string} Hora formateada
 */
const formatTime = (date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toTimeString().split(" ")[0].substring(0, 5);
};

/**
 * Verifica si una fecha es válida
 * @param {any} date - Fecha a validar
 * @returns {boolean}
 */
const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Verifica si una fecha está en el pasado
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean}
 */
const isDateInPast = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
};

/**
 * Sanitiza un string eliminando espacios extra
 * @param {string} str - String a sanitizar
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/\s+/g, " ");
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Genera un objeto de respuesta estandarizado
 * @param {boolean} success - Si la operación fue exitosa
 * @param {any} data - Datos de respuesta
 * @param {string} message - Mensaje descriptivo
 * @returns {object}
 */
const buildResponse = (success, data = null, message = null) => {
  const response = { success };
  if (message) response.message = message;
  if (data !== null) response.data = data;
  return response;
};

/**
 * Excluye campos de un objeto
 * @param {object} obj - Objeto original
 * @param {array} fields - Campos a excluir
 * @returns {object}
 */
const excludeFields = (obj, fields = []) => {
  if (!obj) return obj;
  const newObj = { ...obj };
  fields.forEach((field) => delete newObj[field]);
  return newObj;
};

/**
 * Verifica si dos rangos horarios se solapan
 * @param {Date} start1 - Inicio del primer rango
 * @param {Date} end1 - Fin del primer rango
 * @param {Date} start2 - Inicio del segundo rango
 * @param {Date} end2 - Fin del segundo rango
 * @returns {boolean}
 */
const doTimeRangesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

/**
 * Extrae la fecha sin hora de un objeto Date
 * @param {Date} date - Fecha completa
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
const getDateOnly = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Combina fecha y hora en un objeto Date
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:MM
 * @returns {Date}
 */
const combineDateAndTime = (date, time) => {
  return new Date(`${date}T${time}:00`);
};

/**
 * Valida si un horario de fin es posterior al de inicio
 * @param {Date|string} startTime - Hora de inicio
 * @param {Date|string} endTime - Hora de fin
 * @returns {boolean}
 */
const isEndTimeAfterStart = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return end > start;
};

module.exports = {
  formatDate,
  formatTime,
  isValidDate,
  isDateInPast,
  sanitizeString,
  capitalize,
  buildResponse,
  excludeFields,
  doTimeRangesOverlap,
  getDateOnly,
  combineDateAndTime,
  isEndTimeAfterStart,
};