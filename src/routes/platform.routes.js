const express = require("express");
const router = express.Router();

const PlatformController = require("../controllers/platform.controller");
const jwtController = require("../config/jwtVerify");

const {
    getAllPlatforms, addPlatform, updatePlatform, deletePlatform, getPlatformById
} = PlatformController();



router.use(jwtController.protect);
router.get("/get-all-platforms", getAllPlatforms);
router.post("/add-platform", addPlatform)
router.put("/update-platform", updatePlatform)
router.delete("/delete-platform", deletePlatform)
router.get("/get-platform-by-id", getPlatformById)

module.exports = router;  