const express = require('express');
const router = express.Router();
const InfluencerController = require('../controllers/influencer.controller');


const { getInfluencersByPlatformId } = InfluencerController();



router.post('/get-influencers-by-platform', getInfluencersByPlatformId);
module.exports = router;
