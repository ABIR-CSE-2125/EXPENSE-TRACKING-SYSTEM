import { Router } from "express";
import { upload } from "../middlewares/fileUpload.middleware.js";
import { register } from "../controllers/user.controller.js";
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

export default router;
