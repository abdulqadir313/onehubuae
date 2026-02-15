const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/brand.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");
const { uploadImage } = require("../handlers/uploadImage");

const { getBrandProfile, updateBrandProfile, updateBrandCoverImage } =
  BrandController();

router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.BRAND));
router.get("/get-profile", getBrandProfile);
router.put("/update-profile", updateBrandProfile);
router.put("/update-cover-image", uploadImage.single("cover_image"), updateBrandCoverImage);

module.exports = router;
