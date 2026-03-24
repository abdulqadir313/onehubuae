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
  getAllSocialAccounts,
  addSocialAccount,
  updateSocialAccount,
  deleteSocialAccount,
  getSocialAccountById,
} = InfluencerController();
router.post("/influencers-by-platform", getInfluencersByPlatformId);
router.get("/get-social-account-by-id", getSocialAccountById);
router.get("/get-all-social-accounts", getAllSocialAccounts);
router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.INFLUENCER));
router.get("/get-profile", getInfluencerProfile);
router.put("/update-profile", uploadImage.single("image"), updateInfluencerProfile);
router.put("/update-platforms", updateInfluencersPlatform);
router.put("/update-categories", updateInfluencerCategories);
router.post("/add-social-account", addSocialAccount);
router.put("/update-social-account", updateSocialAccount);
router.delete("/delete-social-account", deleteSocialAccount);



module.exports = router;
