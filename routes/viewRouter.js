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
router.get('/', viewController.showRoot);
router.get('/login', viewController.showLogin);
router.get('/signup', viewController.showSignup);

export default router;
