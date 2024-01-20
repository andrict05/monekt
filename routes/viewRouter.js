import express from 'express';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isLoggedIn } from '../controllers/authController.js';
import * as viewController from '../controllers/viewController.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const router = express.Router();

/**************************************************/
// ENDPOINTS
/**************************************************/
// router.get('/', viewController.showRoot);

// Language middleware
router.use((req, res, next) => {
  req.lang = req.query.lang || req.cookies.lang;
  next();
});

router.get('/signin', viewController.renderSigninPage);
router.get('/signup', viewController.renderSignupPage);
router.get('/forgot-password', viewController.renderForgotPasswordPage);

export default router;