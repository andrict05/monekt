import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  if (error.keyPattern?.email)
    return new AppError(`This email address already belongs to someone.`, 400);
  if (error.keyPattern?.username)
    return new AppError(`This username already belongs to someone.`, 400);
  return new AppError(
    `Duplicate field value: ${
      Object.keys(error.keyPattern)[0]
    }. Please use another value!`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = 'Invalid input data. ' + errors.join('. ');
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token! Please log in.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in.', 401);

export default (error, request, response, next) => {
  let err = { ...error };
  err.message = error.message;

  if (error.name === 'CastError') err = handleCastErrorDB(error);
  if (error.code === 11000) err = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') err = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') err = handleJWTError(error);
  if (error.name === 'TokenExpiredError') err = handleJWTExpiredError(error);
  const statusCode = err.statusCode ?? 500;

  response.status(statusCode).json({
    isOperational: err?.isOperational ? true : false,
    status: 'error',
    statusCode,
    message: err.message,
  });
};
