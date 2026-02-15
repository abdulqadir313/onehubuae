const express = require("express");
const router = express.Router();
const CampaignController = require("../controllers/campaign.controller");
const { protect } = require("../config/jwtVerify");

const { getCampaigns } = CampaignController();

router.use(protect);
router.get("/get-campaigns", getCampaigns);

module.exports = router;
