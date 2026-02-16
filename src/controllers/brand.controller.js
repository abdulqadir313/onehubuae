const {
  UserModel,
  BrandProfileModel,
  UserTypeModel,
  UserStatusModel,
  WishlistModel,
  WishlistItemModel,
  InfluencerProfileModel,
} = require("../models");
const { deleteImage } = require("../handlers/uploadImage");

const BrandController = () => {
  /**
   * @description Get authenticated brand user's profile
   * @param req
   * @param res
   * @returns Brand profile with user, type and status
   */
  const getBrandProfile = async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await UserModel.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include: [
          { model: UserTypeModel, attributes: ["id", "type_name"] },
          { model: UserStatusModel, attributes: ["id", "status_name"] },
          { model: BrandProfileModel, required: true },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Brand profile not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Update brand profile (company_name, industry, website, company_size)
   * @param req
   * @param res
   * @returns Updated brand profile
   */
  const updateBrandProfile = async (req, res) => {
    try {
      const userId = req.user.id;

      const { company_name, industry, website, company_size } = req.body;
      const profile = await BrandProfileModel.findOne({
        where: { user_id: userId },
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Brand profile not found.",
        });
      }

      const updates = {};
      if (company_name != null) updates.company_name = company_name;
      if (industry != null) updates.industry = industry;
      if (website != null) updates.website = website;
      if (company_size != null) updates.company_size = company_size;

      await profile.update(updates);
      return res.status(200).json({
        success: true,
        message: "Brand profile updated.",
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Update brand cover image (deletes old image from Cloudinary if present)
   * @param req
   * @param res
   * @returns Updated cover image URL
   */
  const updateBrandCoverImage = async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file || !req.file.path) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded.",
        });
      }

      const profile = await BrandProfileModel.findOne({
        where: { user_id: userId },
      });
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Brand profile not found.",
        });
      }

      if (profile.cover_image) {
        await deleteImage(profile.cover_image);
      }

      await profile.update({ cover_image: req.file.path });
      return res.status(200).json({
        success: true,
        message: "Cover image updated.",
        data: { cover_image: req.file.path },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  

  return {
    getBrandProfile,
    updateBrandProfile,
    updateBrandCoverImage
  }
};

module.exports = BrandController;
