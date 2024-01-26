import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as viewController from '../controllers/viewController.js';
import { locales } from '../utils/localization.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const router = express.Router();

/**************************************************/
// ENDPOINTS
/**************************************************/

// Language middleware
router.use((req, res, next) => {
  let lang = req.query.lang || req.cookies.lang;
  req.lang = Object.keys(locales).some((val) => val === lang) ? lang : 'en';
  res.cookie('lang', req.lang, {
    httpOnly: true,
  });
  next();
});

router.get('/', viewController.renderHomePage);
router.get('/signin', viewController.renderSigninPage);
router.get('/signup', viewController.renderSignupPage);
router.get('/forgot-password', viewController.renderForgotPasswordPage);

export default router;
