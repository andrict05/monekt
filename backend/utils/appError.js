export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode ?? 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
