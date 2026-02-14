const db = require("../config/db");
const CategoriesModel = require("../models/category");
const CategoriesController = () => {
  const getAllCategories = async (req, res) => {
    try {
      const categories = await CategoriesModel.findAll({
        attributes: [
          "category_id",
          "category_name",
          "category_slug",
          "category_image",
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
