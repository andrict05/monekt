import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsyncError from '../utils/catchAsyncError.js';

/**************************************************/
//
/**************************************************/
const filterObjectFields = (obj, ...fields) => {
  const newObject = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) newObject[key] = obj[key];
  });
  return newObject;
};

/**************************************************/
// '/'
/**************************************************/
export const getAllUsers = catchAsyncError(async (request, response, next) => {
  const users = await User.find({});
  response.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

export const createUser = catchAsyncError(async (request, response, next) => {
  response.status(500).json({
    status: 'error',
    message: 'Route not defined, use /signup instead.',
  });
});
/**************************************************/
// '/:id'
/**************************************************/
export const getUser = catchAsyncError(async (request, response, next) => {
  const requestedUserId = request.params.id;
  const userDocument = await User.findById(requestedUserId);
  if (!userDocument) {
    return next(
      new AppError(`No user found with id:'${requestedUserId}'.`, 404)
    );
  }
  response.status(200).json({
    status: 'success',
    data: {
      user: userDocument,
    },
  });
});

export const updateUser = catchAsyncError(async (request, response, next) => {
  if (request.body.password || request.body.passwordConfirm) {
    return next(
      new AppError(`Can't change password(s) using this route.`, 400)
    );
  }
  const requestedUserId = request.params.id;
  const userDocument = await User.findByIdAndUpdate(
    requestedUserId,
    request.body,
    {
      validateBeforeSave: true,
    }
  );

  if (!userDocument) {
    return next(
      new AppError(`No user found with id:'${requestedUserId}'.`, 404)
    );
  }

  response.status(200).json({
    status: 'success',
    data: {
      user: userDocument,
    },
  });
});

/**************************************************/
// '/authenticated'
/**************************************************/
export const getMe = catchAsyncError(async (request, response, next) => {
  const user = await User.findById(request.user.id);
  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateMe = catchAsyncError(async (request, response, next) => {
  if (request.body?.password || request.body?.passwordConfirm) {
    return next(
      new AppError(`Can't change password(s) using this route.`, 400)
    );
  }
  const user = await User.findByIdAndUpdate(request.user.id, request.body, {
    runValidators: true,
    new: true,
  });
  response.status(200).json(user);
});

export const deleteMe = catchAsyncError(async (request, response, next) => {
  const authenticatedUserId = request.user.id;
  const userDocument = await User.findByIdAndDelete(authenticatedUserId);
  if (!userDocument)
    return next(
      new AppError(`No user found with id:'${authenticatedUserId}'.`, 404)
    );
  response.status(200).json({
    status: 'success',
    data: null,
  });
});
