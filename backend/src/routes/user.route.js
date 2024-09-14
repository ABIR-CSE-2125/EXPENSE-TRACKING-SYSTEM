import { Router } from "express";
import { upload } from "../middlewares/fileUpload.middleware.js";
import {
  changePassword,
  deleteUser,
  getUser,
  login,
  logout,
  refershAccessToken,
  register,
  updateProfile,
  updateProfilePic,
  addFriends,
  deleteFriend,
  getFriends,
  createGroups,
  getGroups,
  deleteGroup,
  removeUserFromGroup,
} from "../controllers/user.controller.js";
import { isAuthenicated } from "../middlewares/auth.middleware.js";
const router = Router();

// user routes
router.route("/register").post(upload.single("image"), register); // Register Or SignUp a User aka Create User

router.route("/login").post(login); // Login a User

// Secured Route --> User have to authenticted for doing these tasks
router.route("/logout").post(isAuthenicated, logout); // Logout a User
router.route("/refresh-access-token").post(refershAccessToken); // Refresh the Access token while the refresh token in still valid!!
router.route("/changePassword").patch(isAuthenicated, changePassword); // Change Password
router.route("/").get(isAuthenicated, getUser); // Get User's Data
router.route("/update").patch(isAuthenicated, updateProfile); // Update The Users Data
router
  .route("/update-ProfilePic")
  .patch(isAuthenicated, upload.single("image"), updateProfilePic); // Update the user's profile picture
router.route("/delete/:userId").delete(isAuthenicated, deleteUser); // Delete the User
// Friend Related Routes
router.route("/add-friend").post(isAuthenicated, addFriends); // Add friends to the friend list of USer
router.route("/friends").get(isAuthenicated, getFriends); // Get All the friends data of the USer
router.route("/remove-friend/:friendId").delete(isAuthenicated, deleteFriend); // Delete a friend from the friend from the list

// Group Related Routes
router
  .route("/add-group")
  .post(isAuthenicated, upload.single("image"), createGroups);
router.route("/groups").get(isAuthenicated, getGroups); // Get All the friends data of the USer
router.route("/delete-group/:groupId").delete(isAuthenicated, deleteGroup); // Delete a friend from the friend from the list
router
  .route("/remove-group/:groupId")
  .delete(isAuthenicated, removeUserFromGroup);
export default router;
