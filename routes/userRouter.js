import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

/**************************************************/
// API ENDPOINTS: USERS
/**************************************************/
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.use(authController.protectRoute);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/authenticated")
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);

export default router;
