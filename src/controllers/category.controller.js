const { CategoriesModel } = require("../models");

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

  const addCategory = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      const existingCategory = await CategoriesModel.findOne({
        where: { name },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category Already Exists",
        })
      }

      const category = await CategoriesModel.create({
        name,
        slug,
      });
      res.status(201).json({
        success: true,
        data: category,
      })
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  const updateCategory = async (req, res) => {
    try {
      const { id } = req.body;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        })
      }


      const category = await CategoriesModel.findByPk(id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category Id Not Found",
        })
      }

      const existingCategory = await CategoriesModel.findOne({
        where: { name },
      });

      if (existingCategory && existingCategory.id != id) {
        return res.status(400).json({
          success: false,
          message: "Category Name Already Existing",
        });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      await category.update({
        name,
        slug,
      });
      res.status(201).json({
        success: true,
        message: "Category Updated Successfully",
        data: category
      });
    }

    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


  const deleteCategory = async()=>{

  }


  return {
    getAllCategories, addCategory, updateCategory, deleteCategory
  };
};

module.exports = CategoriesController;
