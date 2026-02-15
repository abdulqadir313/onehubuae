const express = require("express");
const router = express.Router();
const InfluencerController = require("../controllers/influencer.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");
const { uploadImage } = require("../handlers/uploadImage");

const {
  getInfluencerProfile,
  updateInfluencerProfile,
  getInfluencersByPlatformId,
  updateInfluencersPlatform,
  updateInfluencerCategories,
} = InfluencerController();

router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.INFLUENCER));
router.get("/get-profile", getInfluencerProfile);
router.put("/update-profile", uploadImage.single("image"), updateInfluencerProfile);
router.post("/influencers-by-platform", getInfluencersByPlatformId);
router.put("/update-platforms", updateInfluencersPlatform);
router.put("/update-categories", updateInfluencerCategories);

module.exports = router;
