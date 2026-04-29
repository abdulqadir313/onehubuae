const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/brand.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");
const { uploadImage } = require("../handlers/uploadImage");

const { getBrandProfile, updateBrandProfile, updateBrandProfileImages, updateBrandSocialProfile, updateBrandAccountDetails, getBrandsListing } =
  BrandController();
router.post("/brands-list", getBrandsListing);
router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.BRAND));
router.get("/get-profile", getBrandProfile);
router.put("/update-profile", updateBrandProfile);
router.put("/update-social-profile", updateBrandSocialProfile);
router.put("/update-account-details", updateBrandAccountDetails);
router.put("/update-profile-images", uploadImage.fields([{ name: "cover_image", maxCount: 1 },{ name: "profile_pic", maxCount: 1 },]),updateBrandProfileImages);

module.exports = router;
