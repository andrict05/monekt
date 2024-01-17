import express from "express";
import * as authController from "../controllers/authController.js";
import * as postController from "../controllers/postController.js";

const router = express.Router();

/**************************************************/
// API ENDPOINTS: POSTS
/**************************************************/

router.use(authController.protectRoute);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.get("/myPosts", postController.getMyPosts);

router
  .route("/:id")
  .get(postController.getPostById)
  .delete(postController.deletePost);

export default router;
