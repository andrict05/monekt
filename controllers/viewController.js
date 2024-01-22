import * as authController from '../controllers/authController.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import { locales } from '../utils/localization.js';

export const renderHomePage = catchAsyncError(async (req, res, _next) => {
  if (!(await authController.isLoggedIn(req))) {
    return res.status(401).redirect('/signin');
  }
  return res.status(200).render('home', {
    title: 'Home',
    text: 'This is a text',
    locale: locales[req.lang],
  });
});

export const renderSigninPage = catchAsyncError(async (req, res, _next) => {
  if (await authController.isLoggedIn(req)) {
    return res.status(302).redirect('/');
  }
  return res.status(200).render('signin', {
    title: 'Sign in',
    locale: locales[req.lang],
  });
});

export const renderSignupPage = catchAsyncError(async (req, res, _next) => {
  if (await authController.isLoggedIn(req)) {
    return res.status(302).redirect('/');
  }
  return res.status(200).render('signup', {
    title: 'Sign up',
    locale: locales[req.lang],
  });
});

export const renderForgotPasswordPage = catchAsyncError(
  async (req, res, _next) => {
    return res.status(200).render('forgot-password', {
      title: 'Forgot password',
      locale: locales[req.lang],
    });
  },
);
