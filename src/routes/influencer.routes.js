const express = require("express");
const router = express.Router();
const InfluencerController = require("../controllers/influencer.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");
const { uploadImage } = require("../handlers/uploadImage");

const {
  getInfluencerProfile,
  updateInfluencerProfile,
  getInfluencersList,
  updateInfluencersPlatform,
  updateInfluencerCategories,
  getAllSocialAccounts,
  addSocialAccount,
  updateSocialAccount,
  deleteSocialAccount,
  getSocialAccountById,
  updateInfluencerAudienceGender,
  updateInfluencerAudienceAge,
  updateInfluencerAudienceLocations,
  getPublicInfluencerProfile,
  updateInfluencerGallery,
} = InfluencerController();
router.post("/get-influencers-list", getInfluencersList);
router.get("/get-social-account-by-id", getSocialAccountById);
router.get("/get-all-social-accounts", getAllSocialAccounts);
router.get("/public-profile", getPublicInfluencerProfile);
router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.INFLUENCER));
router.get("/get-profile", getInfluencerProfile);
router.put("/update-profile", updateInfluencerProfile);
router.put(
  "/update-gallery",
  uploadImage.array("gallery_pic", 10),
  updateInfluencerGallery
);
router.put("/update-platforms", updateInfluencersPlatform);
router.put("/update-categories", updateInfluencerCategories);
router.put("/update-audience-gender", updateInfluencerAudienceGender);
router.put("/update-audience-age", updateInfluencerAudienceAge);
router.put("/update-audience-locations", updateInfluencerAudienceLocations);
router.post("/add-social-account", addSocialAccount);
router.put("/update-social-account", updateSocialAccount);
router.delete("/delete-social-account", deleteSocialAccount);



module.exports = router;
