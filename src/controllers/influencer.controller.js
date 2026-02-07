const InfluencerModel = require('../models/influencer');
const SocialProfileModel = require('../models/social_profile');

// const influencerService = require('../services/influencer.service');

// exports.getAllInfluencers = async (req, res) => {
//   try {
//     const platform = req.query.platform || null;

//     const influencers = await influencerService.getAllInfluencers(platform);

//     res.status(200).json({
//       success: true,
//       count: influencers.length,
//       platform: platform || 'all',
//       data: influencers
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch influencers'
//     });
//   }
// };


const InfluencerController = () => {
  const getInfluencersByPlatformId = async (req, res) => {
    try {
      const { platform_id } = req.query;
      const influencers = await InfluencerModel.findAll({
        include: [
          {
            model: SocialProfileModel,
            where: {
              platform_id: platform_id,
            },
          },
        ],
      });
      res.status(200).json({
        success: true,
        data: influencers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  return {
    getInfluencersByPlatformId,
  }
}

module.exports = InfluencerController;