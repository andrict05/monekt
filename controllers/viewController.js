import path from 'path';
import User from '../models/userModel.js';
import { fileURLToPath } from 'url';
import { isLoggedIn } from '../controllers/authController.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// list all files inside of a directory
fs.readdirSync(path.join(__dirname, '../localization/')).forEach((file) => {
  console.log(file);
});

export const renderSigninPage = catchAsyncError(
  async (request, response, next) => {
    if (await isLoggedIn(request)) {
      // return response.status(401).redirect('/');
    }
    return response.status(200).render('signin', {
      title: 'Sign in',
      text: '',
    });
  },
);

export const renderSignupPage = catchAsyncError(
  async (request, response, next) => {
    if (await isLoggedIn(request)) {
      // return response.status(401).redirect('/');
    }
    return response.status(200).render('signup', { title: 'Sign up' });
  },
);

export const renderForgotPasswordPage = catchAsyncError(
  async (request, response, next) => {
    if (await isLoggedIn(request)) {
      // return response.status(401).redirect('/');
    }
    return response
      .status(200)
      .render('forgot-password', { title: 'Forgot password' });
  },
);

export const showRoot = catchAsyncError(async (request, response, next) => {
  if (!(await isLoggedIn(request))) {
    return response.status(401).redirect('/login');
  }
  return response
    .status(200)
    .sendFile(path.join(__dirname, '../public/home.html'));
});

export const showLogin = catchAsyncError(async (request, response, next) => {
  if (await isLoggedIn(request)) {
    return response.status(302).redirect('/');
  }
  return response
    .status(200)
    .sendFile(path.join(__dirname, '../public/auth.html'));
});

export const showSignup = catchAsyncError(async (request, response, next) => {
  if (await isLoggedIn(request)) {
    return response.status(302).redirect('/');
  }
  return response.status(200).redirect('/login?signup');
});
