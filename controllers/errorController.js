import AppError from '../utils/appError.js';
import { locales } from '../utils/localization.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  if (error.keyPattern?.email) return new AppError(`DUPLICATE_EMAIL`, 400);
  if (error.keyPattern?.username)
    return new AppError(`DUPLICATE_USERNAME`, 400);
  return new AppError(
    `Duplicate field value: ${Object.keys(error.keyPattern).join(
      ', ',
    )}. Please use another value!`,
    400,
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = 'Invalid input data. ' + errors.join('. ');
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('AUTH_UNAUTHENTICATED', 401);

const handleJWTExpiredError = () => new AppError('AUTH_TOKEN_EXPIRED', 401);

export default (error, request, response, next) => {
  let err = { ...error };
  err.message = error.message;

  if (error.name === 'CastError') err = handleCastErrorDB(error);
  if (error.code === 11000) err = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') err = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') err = handleJWTError(error);
  if (error.name === 'TokenExpiredError') err = handleJWTExpiredError(error);
  const statusCode = err.statusCode ?? 500;

  let responseMessage = {};
  const codeMessage = locales[request.lang].errors?.[err.message];
  if (codeMessage) {
    responseMessage.messageCode = err.message;
    responseMessage.messageTitle = locales[request.lang].text['errorTitle'];
    responseMessage.message = codeMessage;
  } else {
    responseMessage.messageCode = 'UNEXPECTED_ERROR';
    responseMessage.messageTitle = 'Something went wrong';
    responseMessage.message = err.message;
  }

  return response.status(statusCode).json({
    isOperational: err?.isOperational ? true : false,
    status: 'error',
    statusCode,
    ...responseMessage,
  });
};
