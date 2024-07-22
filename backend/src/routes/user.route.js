import { Router } from "express";
import { upload } from "../middlewares/fileUpload.middleware.js";
import { login, logout, register } from "../controllers/user.controller.js";
import { isAuthenicated } from "../middlewares/auth.middleware.js";
const router = Router();

// user routes
router.route("/register").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  register
);

router.route("/login").post(login);

// Secured Route
router.route("/logout").post(isAuthenicated, logout);
export default router;
