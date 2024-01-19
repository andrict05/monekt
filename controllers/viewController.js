import path from 'path';
import User from '../models/userModel.js';
import { fileURLToPath } from 'url';
import { isLoggedIn } from '../controllers/authController.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

let locales = {};

// list all files inside of a directory
fs.readdirSync(path.join(__dirname, '../locales/')).forEach((file) => {
  const content = fs.readFileSync(path.join(__dirname, '../locales/', file));
  const contentJson = JSON.parse(content);
  locales[file.split('.')[0]] = contentJson;
});

const getLang = (req) => {
  return Object.keys(locales).some((val) => val === req.lang) ? req.lang : 'en';
};

export const renderSigninPage = catchAsyncError(async (req, res, next) => {
  // if (await isLoggedIn(request)) {
  // return res.status(401).redirect('/');
  // }
  res.cookie('lang', getLang(req), { maxAge: 900000, httpOnly: true });
  return res.status(200).render('signin', {
    title: 'Sign in',
    locale: locales[getLang(req)],
  });
});

export const renderSignupPage = catchAsyncError(async (req, res, next) => {
  // if (await isLoggedIn(request)) {
  // return res.status(401).redirect('/');
  // }
  res.cookie('lang', getLang(req), { maxAge: 900000, httpOnly: true });
  return res.status(200).render('signup', {
    title: 'Sign up',
    locale: locales[getLang(req)],
  });
});

export const renderForgotPasswordPage = catchAsyncError(
  async (req, res, next) => {
    // if (await isLoggedIn(request)) {
    // return res.status(401).redirect('/');
    // }
    res.cookie('lang', getLang(req), { maxAge: 900000, httpOnly: true });
    return res.status(200).render('forgot-password', {
      title: 'Forgot password',
      locale: locales[getLang(req)],
    });
  },
);
