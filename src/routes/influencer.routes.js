const express = require("express");
const router = express.Router();
const InfluencerController = require("../controllers/influencer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadImage } = require("../handlers/uploadImage");

const {
  getInfluencersByPlatformId,
  addInfluencer,
  login,
  logout,
  getInfluencerProfile,
  forgotPassword,
  resetPassword,
  updateInfluencerProfile,
} = InfluencerController();

router.post("/get-influencers-by-platform", getInfluencersByPlatformId);
router.get("/profile", authMiddleware, getInfluencerProfile);
router.post("/addInfluencer", addInfluencer);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-influencer-profile", authMiddleware, uploadImage.single("image"), updateInfluencerProfile);

module.exports = router;
