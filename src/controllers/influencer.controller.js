const { Op, where } = require("sequelize");
const {
  UserModel,
  InfluencerProfileModel,
  UserTypeModel,
  UserStatusModel,
  SocialAccountModel,
  PlatformModel,
  CategoriesModel,
} = require("../models");
const { uploadImage } = require("../handlers/uploadImage");
const { errorMonitor } = require("nodemailer/lib/xoauth2");


const InfluencerController = () => {
  /**
   * @description Get authenticated influencer user's profile with social accounts and categories
   * @param req
   * @param res
   * @returns Influencer profile with user, type, status, social accounts, categories
   */
  const getInfluencerProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include: [
          { model: UserTypeModel, attributes: ["id", "type_name"] },
          { model: UserStatusModel, attributes: ["id", "status_name"] },
          { model: InfluencerProfileModel, required: true },
          {
            model: SocialAccountModel,
            required: false,
            include: [{ model: PlatformModel, attributes: ["id", "name", "icon"] }],
          },
          {
            model: CategoriesModel,
            through: { attributes: [] },
            attributes: ["id", "name", "slug", "image"],
            required: false,
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Influencer profile not found.",
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
   * @description Update influencer profile (display_name, price_start, bio, profile_pic)
   * @param req
   * @param res
   * @returns Success message or updated profile picture URL
   */
  const updateInfluencerProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (req.file?.path) {
        await user.update({ profile_pic: req.file.path });
        return res.status(200).json({
          success: true,
          message: "Profile picture updated.",
          data: { profile_pic: req.file.path },
        });
      }

      const { display_name, price_start, bio } = req.body;
      const profile = await InfluencerProfileModel.findOne({
        where: { user_id: userId },
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Influencer profile not found.",
        });
      }

      const userUpdates = {};
      if (bio != null) userUpdates.bio = bio;
      await user.update(userUpdates);

      const profileUpdates = {};
      if (display_name != null) profileUpdates.display_name = display_name;
      if (price_start != null) profileUpdates.price_start = price_start;
      await profile.update(profileUpdates);

      return res.status(200).json({
        success: true,
        message: "Influencer profile updated.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get influencers by platform (and optional category filter)
   * @param req
   * @param res
   * @returns List of users with influencer profile and social account for the platform
   */
  const getInfluencersByPlatformId = async (req, res) => {
    try {
      const { platform_id, category_id } = req.body;

      if (!platform_id) {
        return res.status(400).json({
          success: false,
          message: "platform_id is required.",
        });
      }

      const category_ids = Array.isArray(category_id) ? category_id : [];

      const includes = [
        { model: InfluencerProfileModel, required: true },
        {
          model: SocialAccountModel,
          where: { platform_id },
          required: true,
        },
      ];

      if (category_ids.length > 0) {
        includes.push({
          model: CategoriesModel,
          through: { attributes: [] },
          where: { id: { [Op.in]: category_ids } },
          required: true,
        });
      }

      const users = await UserModel.findAll({
        attributes: { exclude: ["password"] },
        include: [
          { model: UserTypeModel, attributes: ["id", "type_name"] },
          { model: UserStatusModel, attributes: ["id", "status_name"] },
          ...includes,
        ],
      });

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Update influencer's platforms (replaces all; user can have multiple)
   * @param req
   * @param res
   * @returns Updated list of social accounts
   */
  const updateInfluencersPlatform = async (req, res) => {
    try {
      const userId = req.user.id;
      const { platforms } = req.body;
      if (!Array.isArray(platforms)) {
        return res.status(400).json({
          success: false,
          message: "platforms must be an array.",
        });
      }

      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      await SocialAccountModel.destroy({ where: { user_id: userId } });

      const toCreate = platforms
        .filter((p) => p && p.platform_id != null)
        .map((p) => ({
          user_id: userId,
          platform_id: p.platform_id,
          username: p.username || null,
          profile_url: p.profile_url || null,
          followers: p.followers ?? null,
          engagement_rate: p.engagement_rate ?? null,
        }));

      if (toCreate.length > 0) {
        await SocialAccountModel.bulkCreate(toCreate);
      }

      const accounts = await SocialAccountModel.findAll({
        where: { user_id: userId },
        include: [{ model: PlatformModel, attributes: ["id", "name", "icon"] }],
      });

      return res.status(200).json({
        success: true,
        message: "Platforms updated.",
        data: accounts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Update influencer's categories (replaces all; user can have multiple)
   * @param req
   * @param res
   * @returns Success message and updated category ids
   */
  const updateInfluencerCategories = async (req, res) => {
    try {
      const userId = req.user.id;
      const { category_ids } = req.body;
      if (!Array.isArray(category_ids)) {
        return res.status(400).json({
          success: false,
          message: "category_ids must be an array.",
        });
      }

      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      await user.setCategoriesModels(category_ids);

      const categories = await user.getCategories({
        attributes: ["id", "name", "slug", "image"],
      });

      return res.status(200).json({
        success: true,
        message: "Categories updated.",
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  const getAllSocialAccounts = async (req, res) => {
    try {
      const accounts = await SocialAccountModel.findAll({
        attributes: [
          "user_id",
          "platform_id",
          "username",
          "profile_url",
          "followers",
          "engagement_rate",
        ],
      });

      return res.status(200).json({
        success: true,
        data: accounts,
      });

    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };


  const addSocialAccount = async (req, res) => {
    try {
      const userId = req.user.id;
      const { platform_id, username, profile_url, followers, engagement_rate } = req.body;

      if (!userId || !platform_id || !username) {
        return res.status(400).json({
          success: false,
          message: " user_id platform_id is required",
        })
      }

      const existingSocialAccount = await SocialAccountModel.findOne({
        where: {
          user_id: userId,
          platform_id: platform_id
        },
      });

      console.log(existingSocialAccount)

      if (existingSocialAccount) {
        return res.status(400).json({
          success: false,
          message: "Social Account Already Exists",
        });
      }

      await SocialAccountModel.create({
        user_id: userId,
        platform_id,
        username,
        profile_url,
        followers,
        engagement_rate,

      });

      return res.status(200).json({
        success: true,
        message: "Social Account created successfully",
      });
    }

    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }



  const updateSocialAccount = async (req, res) => {
    try {

      const { id, user_id, platform_id, username, profile_url, followers, engagement_rate } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: " id is required"
        });
      }

      const socialAccount = await SocialAccountModel.findByPk(id)
      if (!socialAccount) {
        return res.status(400).json({
          success: false,
          message: "social account not found"
        });
      }

      if (username || platform_id) {
        const existingSocialAccount = await SocialAccountModel.findOne({
          where: {
            username: username ?? socialAccount.username,
            platform_id: platform_id ?? socialAccount.platform_id
          }
        });

        if (existingSocialAccount && existingSocialAccount.id !== id) {
          return res.status(400).json({
            success: false,
            message: "this user already exits on platform"
          })
        }
      }
      await socialAccount.update({

        user_id: user_id ?? socialAccount.user_id,
        platform_id: platform_id ?? socialAccount.platform_id,
        username: username ?? socialAccount.username,
        profile_url: profile_url ?? socialAccount.profile_url,
        followers: followers ?? socialAccount.followers,
        engagement_rate: engagement_rate ?? socialAccount.engagement_rate
      });
      return res.status(200).json({
        success: true,
        message: "Social Account Updated Successfully",
        data: socialAccount
      })
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  const deleteSocialAccount = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Social Account id is Required"
        });
      }
      const socialAccount = await SocialAccountModel.findByPk(id);

      if (!socialAccount) {
        return res.status(400).json({
          success: false,
          message: "Social Account not Found"
        });
      }

      await socialAccount.destroy();

      return res.status(200).json({
        success: true,
        message: " Social Account Deleted Successfully"
      });

    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


const getSocialAccountById = async(req,res)=>{
  try{
    const { id } = req.body;
console.log(id);
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Account id is required",
                });
            }

            const socialAccount = await SocialAccountModel.findByPk(id);

            if (!socialAccount) {
                return res.status(404).json({
                    success: false,
                    message: "Social Account not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: socialAccount,
            });
        }
  catch(error){ 
    return res.status(500).json({
                success: false,
                message: error.message,
            });
      
    }
}

  return {
    getInfluencerProfile,
    updateInfluencerProfile,
    getInfluencersByPlatformId,
    updateInfluencersPlatform,
    updateInfluencerCategories,
    getAllSocialAccounts,
    addSocialAccount,
    updateSocialAccount,
    deleteSocialAccount,
    getSocialAccountById,
  };
};

module.exports = InfluencerController;
