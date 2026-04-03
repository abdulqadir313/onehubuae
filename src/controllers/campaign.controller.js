const { CampaignModel, CampaignStatusModel, UserModel, CampaignCategoryModel, CategoriesModel } = require("../models");
const database = require("../config/db");
const CampaignController = () => {
  /**
   * @description Get list of campaigns with status
   * @param req
   * @param res
   * @returns List of campaigns
   */

  const registerCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const {
      title,
      description,
      budget_min,
      budget_max,
      start_date,
      end_date,
      number_of_influencers,
      status_id,
      category_ids,
    } = req.body;
    if (!title || !description || !status_id) {
      return res.status(400).json({
        success: false,
        message: "Title, description are required.",
      });
    }
    const campaign = await CampaignModel.create({
      brand_id: userId,
      title,
      description,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      start_date,
      end_date,
      number_of_influencers,
      status_id,
    });
    if (category_ids && category_ids.length > 0) {
      const categoryData = category_ids.map((catId) => ({
        campaign_id: campaign.id,
        category_id: catId,
      }));
      await CampaignCategoryModel.bulkCreate(categoryData);
    }
    const categories = await CategoriesModel.findAll({
      where: {
        id: category_ids,
      },
      attributes: ["id", "name"],
    });
    const campaignWithStatus = await CampaignModel.findByPk(campaign.id, {
      include: [
        {
          model: CampaignStatusModel,
          attributes: ["id", "status_name"],
        },
      ],
    });
    const campaignJson = campaignWithStatus.toJSON();
    const status = campaignJson.campaign_status?.status_name || null;
    delete campaignJson.status_id;
    delete campaignJson.category_id;
    return res.status(201).json({
      success: true,
      message: "Compaign created successful.",
      data: {
        ...campaignJson,
        categories: categories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const campaigns = await CampaignModel.findAll({
      where: {
        brand_id: userId,
      },
      include: [
        {
          model: CampaignStatusModel,
          as: "campaign_status",
          attributes: ["status_name"],
        },
        {
          model: CampaignCategoryModel,
          as: "campaign_categories",
          attributes: ["category_id"],
          include: [
            {
              model: CategoriesModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    const formattedData = campaigns.map((campaign) => {
      const data = campaign.toJSON();
      const status = data.campaign_status?.status_name || null;
      const categories =
        data.campaign_categories?.map((item) => ({
          id: item.category?.id,
          name: item.category?.name,
        })) || [];
      delete data.campaign_status;
      delete data.campaign_categories;
      delete data.status_id;
      delete data.category_id;
      return {
        ...data,
        status,
        categories,
      };
    });
    return res.status(200).json({
      success: true,
      data: formattedData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  const getCampaignDetails = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const campaign = await CampaignModel.findByPk(id, {
      include: [
        {
          model: CampaignStatusModel,
          attributes: ["status_name"],
        },
        {
          model: CampaignCategoryModel,
          as: "campaign_categories",
          attributes: ["category_id"],
          include: [
            {
              model: CategoriesModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    const data = campaign.toJSON();
    const status = data.CampaignStatus?.status_name || null;
    const categories =
      data.campaign_categories?.map((item) => ({
        id: item.category?.id,
        name: item.category?.name,
      })) || [];
    delete data.CampaignStatus;
    delete data.campaign_categories;
    delete data.status_id;
    delete data.category_id;

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        status,
        categories,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editCampaign = async (req, res) => {
  try {
    const { id } = req.body;
    const {
      title,
      description,
      budget_min,
      budget_max,
      start_date,
      end_date,
      status_id,
      category_ids,
    } = req.body;
    const campaign = await CampaignModel.findByPk(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    await campaign.update({
      title,
      description,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      start_date,
      end_date,
      status_id,
    });
    if (category_ids) {
      // delete old
      await CampaignCategoryModel.destroy({
        where: { campaign_id: id },
      });

      // insert new
      if (category_ids.length > 0) {
        const categoryData = category_ids.map((catId) => ({
          campaign_id: id,
          category_id: catId,
        }));

        await CampaignCategoryModel.bulkCreate(categoryData);
      }
    }
    const categories = await CategoriesModel.findAll({
      where: { id: category_ids || [] },
      attributes: ["id", "name"],
    });
    const updatedCampaign = await CampaignModel.findByPk(id, {
      include: [
        {
          model: CampaignStatusModel,
          as: "campaign_status",
          attributes: ["status_name"],
        },
      ],
    });
    const data = updatedCampaign.toJSON();
    const status = data.campaign_status?.status_name || null;
    delete data.campaign_status;
    delete data.status_id;
    delete data.category_id;

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      data: {
        ...data,
        status,
        categories,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.body;
    const campaign = await CampaignModel.findByPk(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    await CampaignCategoryModel.destroy({
      where: { campaign_id: id },
    });
    await campaign.destroy();
    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  return {
    getCampaigns,registerCampaign, getCampaignDetails, editCampaign, deleteCampaign
  };
};

module.exports = CampaignController;
