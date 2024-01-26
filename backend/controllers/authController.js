import User from '../models/userModel.js';
import crypto from 'crypto';
import catchAsyncError from '../utils/catchAsyncError.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Email from '../utils/email.js';
import { log } from 'console';

/**************************************************/
//
/**************************************************/
const signJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createTokenSendResponse = (user, statusCode, response) => {
  const signedToken = signJWT({
    userId: user.id,
    authenticated: true,
  });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_DAYS * 1000 * 60 * 60 * 24,
    ),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    [process.env.NODE_ENV.trim() === 'production'
      ? 'secure'
      : 'rrandomTestTOm']: true,
  };
  user.password = undefined;

  response.cookie('jwt', signedToken, cookieOptions);
  response.status(statusCode).json({
    status: 'success',
    token: signedToken,
    data: {
      data: user,
    },
  });
};

export const isLoggedIn = async (request) => {
  let token;
  if (request.headers?.authorization?.startsWith('Bearer')) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }
  if (!token) {
    return false;
  }
  const decodedJWT = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  const userDocument = await User.findById(decodedJWT.userId);
  if (!userDocument) {
    return false;
  }
  if (userDocument.wasPasswordChangedAfter(decodedJWT.iat)) {
    return false;
  }
  request.decodedJWT = decodedJWT;
  request.user = userDocument;
  return true;
};
/**************************************************/
// API AUTH
/**************************************************/

export const protectRoute = catchAsyncError(async (request, response, next) => {
  let token;
  if (request.headers?.authorization?.startsWith('Bearer')) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('AUTH_UNAUTHENTICATED', 401));
  }
  const decodedJWT = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  const userDocument = await User.findById(decodedJWT.userId);
  if (!userDocument) return next(new AppError(`AUTH_TOKEN_USER_INVALID`, 401));
  if (userDocument.wasPasswordChangedAfter(decodedJWT.iat)) {
    return next(new AppError('AUTH_UNAUTHENTICATED', 401));
  }
  request.decodedJWT = decodedJWT;
  request.user = userDocument;
  next();
});

export const signup = catchAsyncError(async (request, response) => {
  const user = await new User({
    username: request.body.username,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    gender: request.body.gender,
    birthDate: request.body.birthDate,
  });
  await user.save({ validateBeforeSave: true });
  createTokenSendResponse(user, 201, response);
});

export const signin = catchAsyncError(async (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return next(new AppError('AUTH_MISSING_CREDENTIALS', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError(`AUTH_USER_INVALID`, 401));
  }
  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError(`AUTH_INVALID_CREDENTIALS`, 401));
  }
  createTokenSendResponse(user, 200, response);
});

export const logout = catchAsyncError(async (request, response) => {
  const signedToken = jwt.sign(
    { authenticated: false },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE },
  );
  response.cookie('jwt', signedToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    [process.env.NODE_ENV === 'production' ? 'secure' : 'not-secure']: true,
  });
  response.status(200).json({ status: 'success' });
});

export const forgotPassword = catchAsyncError(
  async (request, response, next) => {
    const { email } = request.body;
    if (!email) return next(new AppError(`MISSING_EMAIL`, 400));
    const user = await User.findOne({ email });
    if (!user) return next(new AppError(`AUTH_USER_INVALID`, 400));
    const token = await user.createPasswordResetToken();
    if (!token) {
      return next(new AppError(`AUTH_TOKEN_ERROR`, 500));
    }
    new Email(user, {
      token,
      url: `${request.protocol}://${request.get(
        'host',
      )}/api/v1/users/reset-password/${token}`,
    }).send('forgotPassword', 'Forgot your password?');
    response.status(200).json({
      status: 'success',
      message: 'RESET_TOKEN_SENT',
    });
  },
);

export const resetPassword = catchAsyncError(
  async (request, response, next) => {
    const { token } = request.params;
    const { password, passwordConfirm } = request.body;

    if (!token || !password || !passwordConfirm) {
      return next(new AppError(`AUTH_INVALID_CREDENTIALS`, 400));
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken });
    if (user.passwordResetToken !== hashedToken) {
      return next(new AppError('INVALID_RESET_TOKEN', 400));
    }
    if (!user) {
      return next(new AppError(`AUTH_USER_INVALID`, 404));
    }
    if (user.passwordResetExpireTime < Date.now()) {
      return next(new AppError(`RESET_TIME_EXPIRED`, 403));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpireTime = undefined;

    await user.save({ validateBeforeSave: true });

    createTokenSendResponse(user, 200, response);
  },
);

export const deleteMe = catchAsyncError(async (request, response, next) => {
  const signedToken = jwt.sign(
    { authenticated: false },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE },
  );

  response.cookie('jwt', signedToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    [process.env.NODE_ENV === 'production' ? 'secure' : 'not-secure']: true,
  });

  const user = await User.findByIdAndDelete(request.user.id);
  if (!user) {
    return next(new AppError(`AUTH_USER_INVALID`, 404));
  }
  response.status(204).json({
    status: 'success',
    data: null,
  });
});
