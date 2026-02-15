const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const jwtController = require("../config/jwtVerify");
const { uploadImage } = require("../handlers/uploadImage");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateMyProfile,
  updateProfilePicture,
  changePassword,
  deleteAccount,
} = UserController();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.use(jwtController.protect);  
router.get("/get-profile", getMyProfile);
router.put("/update-profile", updateMyProfile);
router.put("/update-profile-picture", uploadImage.single('profile_pic') , updateProfilePicture);
router.put("/change-password", changePassword);
router.delete("/delete-account", deleteAccount);

module.exports = router;
