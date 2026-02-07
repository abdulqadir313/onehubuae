const express = require('express');
const router = express.Router();

const influencerController = require('../controllers/influencer.controller');

router.get('/', influencerController.getAllInfluencers);

module.exports = router;
