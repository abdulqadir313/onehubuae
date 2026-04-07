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

      const { company_name, industry, bio, company_size } = req.body;
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
      if (company_size != null) updates.company_size = company_size;

      let updatedUser = null;
      if (bio != null) {
        const user = await UserModel.findByPk(userId, {
          attributes: { exclude: ["password"] },
        });

        if (user) {
          await user.update({ bio });
          updatedUser = user;
        }
      }

      await profile.update(updates);
      return res.status(200).json({
        success: true,
        message: "Brand profile details updated.",
        brandProfile: profile,
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const updateBrandAccountDetails = async (req, res) => {
    try {
      const userId = req.user.id;

      const { country, city, phone } = req.body;
      const profile = await BrandProfileModel.findOne({
        where: { user_id: userId },
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Brand profile not found.",
        });
      }

      let updatedUser = null;
      if ( country!= null) {
        const user = await UserModel.findByPk(userId, {
          attributes: { exclude: ["password"] },
        });

        if (user) {
          await user.update({ country, city, phone});
          updatedUser = user;
        }
      }

      //await profile.update(updates);
      return res.status(200).json({
        success: true,
        message: "Brand account details updated.",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  const updateBrandSocialProfile = async (req, res) => {
    try {
      const userId = req.user.id;

      const { website, instagram, youtube, tiktok } = req.body;
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
      if (tiktok != null) updates.tiktok = tiktok;
      if (youtube != null) updates.youtube = youtube;
      if (instagram != null) updates.instagram = instagram;
      if (website != null) updates.website = website;

      await profile.update(updates);
      return res.status(200).json({
        success: true,
        message: "Brand social profile details updated.",
        brandProfile: profile,
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
  
  const updateBrandProfileImages = async (req, res) => {
  try {
    const userId = req.user.id;

    const coverImage = req.files?.cover_image?.[0];
    const profilePic = req.files?.profile_pic?.[0];

    if (!coverImage && !profilePic) {
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

    const user = await UserModel.findByPk(userId);

    // Update cover image
    if (coverImage?.path) {
      if (profile.cover_image) {
        await deleteImage(profile.cover_image);
      }
      await profile.update({ cover_image: coverImage.path });
    }

    // Update profile pic
    if (profilePic?.path && user) {
      if (user.profile_pic) {
        await deleteImage(user.profile_pic);
      }
      await user.update({ profile_pic: profilePic.path });
    }

    return res.status(200).json({
      success: true,
      message: "Images updated successfully.",
      data: {
        cover_image: coverImage?.path || profile.cover_image,
        profile_pic: profilePic?.path || user?.profile_pic,
      },
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
    updateBrandSocialProfile,
    updateBrandProfileImages,
    updateBrandAccountDetails
  }
};

module.exports = BrandController;
