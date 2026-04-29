const express = require("express");
const router = express.Router();
const CampaignController = require("../controllers/campaign.controller");
const jwtController = require("../config/jwtVerify");

const { getCampaigns,registerCampaign,getCampaignDetails,editCampaign,deleteCampaign, saveCampaignPorposal } = CampaignController();

router.use(jwtController.protect);
router.post("/add-campaign", registerCampaign);
router.get("/get-campaigns", getCampaigns);
router.get("/get-campaign-details", getCampaignDetails);
router.put("/edit-campaign", editCampaign);
router.delete("/delete-campaign", deleteCampaign);
router.post("/add-campaign-proposal", saveCampaignPorposal);

module.exports = router;
