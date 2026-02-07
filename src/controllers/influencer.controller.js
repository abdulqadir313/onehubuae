const influencerService = require('../services/influencer.service');

exports.getAllInfluencers = async (req, res) => {
  try {
    const platform = req.query.platform || null;

    const influencers = await influencerService.getAllInfluencers(platform);

    res.status(200).json({
      success: true,
      count: influencers.length,
      platform: platform || 'all',
      data: influencers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch influencers'
    });
  }
};
