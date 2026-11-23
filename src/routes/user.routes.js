const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const jwtController = require("../config/jwtVerify");
const { uploadImage } = require("../handlers/uploadImage");

const {
  registerUser,
  loginUser,
  loginAdminUser,
  logoutUser,
  getMyProfile,
  updateMyProfile,
  updateProfilePicture,
  updateProfilePictureWithUserId,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
  checkEmailExists,
  getAllUsers,
} = UserController();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdminUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/check-email", checkEmailExists);
router.get("/get-all-users", getAllUsers);
router.put("/update-profile-picture-userid", uploadImage.single('profile_pic') , updateProfilePictureWithUserId);
router.use(jwtController.protect);  
router.get("/get-profile", getMyProfile);
router.put("/update-profile", updateMyProfile);
router.put("/update-profile-picture", uploadImage.single('profile_pic') , updateProfilePicture);
router.put("/change-password", changePassword);
router.delete("/delete-account", deleteAccount);

module.exports = router;
