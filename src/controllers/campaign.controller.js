const { CampaignModel, CampaignStatusModel } = require("../models");

const CampaignController = () => {
  /**
   * @description Get list of campaigns with status
   * @param req
   * @param res
   * @returns List of campaigns
   */
  const getCampaigns = async (req, res) => {
    try {
      const campaigns = await CampaignModel.findAll({
        include: [{ model: CampaignStatusModel, attributes: ["id", "status_name"] }],
      });
      return res.status(200).json({
        success: true,
        data: campaigns,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    
  };

  return {
    getCampaigns,
  };
};

module.exports = CampaignController;
