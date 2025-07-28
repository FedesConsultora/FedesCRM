// src/utils/ApiError.js
export default class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR_GENERAL') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
