const db = require("../config/db");
const CategoriesModel = require("../models/category");
const SocialProfile = require("../models/social_profile");
const CategoriesController = () => {
  /**
   * @description Get all active categories
   * @param req
   * @param res
   * @returns List of categories (id, name, slug, image)
   */
  const getAllCategories = async (req, res) => {
    try {
      const categories = await CategoriesModel.findAll({
        attributes: [
          "id",
          "name",
          "slug",
          "image",
        ],
        where: {
          is_active: 1,
        },
      });
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getAllCategories,
  };
};

module.exports = CategoriesController;
