const { Op, where, fn, col,literal  } = require("sequelize");
const {
  UserModel,
  InfluencerProfileModel,
  InfluencerAudienceGenderModel,
  InfluencerAudienceLocationsModel,
  InfluencerAudienceAgeModel,
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
          {model: SocialAccountModel,required: false,include: [{ model: PlatformModel, attributes: ["id", "name", "icon"] }],},
          {model: CategoriesModel,through: { attributes: [] },attributes: ["id", "name", "slug", "image"],required: false,},
          { model: InfluencerAudienceGenderModel, required: false, attributes: ["id","male", "female", "other"]  },
          { model: InfluencerAudienceAgeModel, required: false, attributes: ["id","age_range", "percentage"] },
          { model: InfluencerAudienceLocationsModel, required: false, attributes: ["id","country", "percentage"] },
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
        message: "Influencer profile data found.",
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

  const updateInfluencerAudienceGender = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const { male = 0, female = 0, other = 0 } = req.body;
    const total = Number(male) + Number(female) + Number(other);
    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "Total percentage must be exactly 100.",
      });
    }
    let genderData = await InfluencerAudienceGenderModel.findOne({
      where: { influencer_id: userId },
    });
    if (genderData) {
      await genderData.update({
        male,
        female,
        other,
      });
    } 
    else {
      genderData = await InfluencerAudienceGenderModel.create({
        influencer_id: userId,
        male,
        female,
        other,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Influencer audience gender updated successfully.",
      data: genderData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInfluencerAudienceAge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { audience_age } = req.body;

    if (!Array.isArray(audience_age) || audience_age.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Audience age must be a non-empty array.",
      });
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const allowedAges = ["13-17", "18-24", "25-34", "35-44", "45-64"];

    for (const item of audience_age) {
      if (!item.age_range || !allowedAges.includes(item.age_range)) {
        return res.status(400).json({
          success: false,
          message: `Invalid age_range: ${item.age_range}`,
        });
      }

      if (
        item.percentage == null ||
        isNaN(item.percentage) ||
        item.percentage < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid percentage for ${item.age_range}`,
        });
      }
    }
    const total = audience_age.reduce(
      (sum, item) => sum + Number(item.percentage),
      0
    );

    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "Total percentage must be exactly 100.",
      });
    }
    await InfluencerAudienceAgeModel.destroy({
      where: { influencer_id: userId },
    });
    const ageData = audience_age.map((item) => ({
      influencer_id: userId,
      age_range: item.age_range,
      percentage: item.percentage,
    }));
    const insertedData = await InfluencerAudienceAgeModel.bulkCreate(ageData);

    return res.status(200).json({
      success: true,
      message: "Influencer audience age updated successfully.",
      AudienceAgeData: insertedData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInfluencerAudienceLocations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { audience_locations } = req.body;
    if (!Array.isArray(audience_locations) || audience_locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Audience locations must be a non-empty array.",
      });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    for (const item of audience_locations) {
      if (!item.country || typeof item.country !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid country value.",
        });
      }

      if (
        item.percentage == null ||
        isNaN(item.percentage) ||
        item.percentage < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid percentage for ${item.country}`,
        });
      }
    }
    const total = audience_locations.reduce((sum, item) => sum + Number(item.percentage),0);
    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "Total percentage must be exactly 100.",
      });
    }
    await InfluencerAudienceLocationsModel.destroy({where: { influencer_id: userId },});
    const locationData = audience_locations.map((item) => ({
      influencer_id: userId,
      country: item.country,
      percentage: item.percentage,
    }));
    const insertedData = await InfluencerAudienceLocationsModel.bulkCreate(locationData);

    return res.status(200).json({
      success: true,
      message: "Audience locations updated successfully.",
      AudienceLocationsData: insertedData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

      const { name, phone, bio, country, city, dob, gender, price_start, category_ids } = req.body;
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
      if (name != null) userUpdates.name = name;
      if (phone != null) userUpdates.phone = phone;
      if (country != null) userUpdates.country = country;
      if (city != null) userUpdates.city = city;
      if (dob != null) userUpdates.dob = dob;
      if (gender != null) userUpdates.gender = gender;
      if (bio != null) userUpdates.bio = bio;
      await user.update(userUpdates);

      const userProfile = {};
      if (price_start != null) userProfile.price_start = price_start;
      if (name != null) userProfile.display_name = name;
      await profile.update(userProfile);

      let categories = [];
      if (Array.isArray(category_ids)) {
        await user.setCategories(category_ids);

        categories = await user.getCategories({
          attributes: ["id", "name", "slug", "image"],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Influencer profile updated.",
        data: {
        user,
        profile,
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


  /**
   * @description Get influencers by platform (and optional category filter)
   * @param req
   * @param res
   * @returns List of users with influencer profile and social account for the platform
   */



const getInfluencersList = async (req, res) => {
  try {
    const {
      platform_id, // now array
      category_id,
      keyword,
      min_price,
      max_price,
      min_followers,
      max_followers,
      min_engagement,
      max_engagement,
      page = 1,
      limit = 10,
    } = req.body;

    const offset = (page - 1) * limit;

    if (!platform_id || platform_id.length === 0) {
      return res.status(400).json({
        success: false,
        message: "platform_id (array) is required.",
      });
    }

    const category_ids = Array.isArray(category_id) ? category_id : [];

    /* =========================
       USER SEARCH
    ========================== */
    const userWhere = {};

    if (keyword) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { bio: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ];
    }

    /* =========================
       SOCIAL FILTER
    ========================== */
    const socialWhere = {
      platform_id: { [Op.in]: platform_id }, // ✅ multiple
    };
    if (min_followers || max_followers) {
      socialWhere.followers = {};
      if (min_followers)
        socialWhere.followers[Op.gte] = min_followers;
      if (max_followers)
        socialWhere.followers[Op.lte] = max_followers;
    }

    if (min_engagement || max_engagement) {
      socialWhere.engagement_rate = {};
      if (min_engagement)
        socialWhere.engagement_rate[Op.gte] = min_engagement;
      if (max_engagement)
        socialWhere.engagement_rate[Op.lte] = max_engagement;
    }

    /* =========================
       PROFILE FILTER
    ========================== */
    const profileWhere = {};

    if (min_price || max_price) {
      profileWhere.price_start = {};
      if (min_price) profileWhere.price_start[Op.gte] = min_price;
      if (max_price) profileWhere.price_start[Op.lte] = max_price;
    }

    /* =========================
       INCLUDE
    ========================== */
    const includes = [
      {
        model: InfluencerProfileModel,
        required: true,
        where: profileWhere,
      },
      {
        model: SocialAccountModel,
        required: true,
        where: socialWhere,
      },
      {
        model: InfluencerAudienceGenderModel,
        required: false,
        attributes: ["id", "male", "female", "other"],
      },
      {
        model: InfluencerAudienceAgeModel,
        required: false,
        attributes: ["id", "age_range", "percentage"],
      },
      {
        model: InfluencerAudienceLocationsModel,
        required: false,
        attributes: ["id", "country", "percentage"],
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

    /* =========================
       MAIN QUERY
    ========================== */
    const { count, rows } = await UserModel.findAndCountAll({
      where: userWhere,
      attributes: { exclude: ["password"] },
      include: [
        { model: UserTypeModel, attributes: ["id", "type_name"] },
        { model: UserStatusModel, attributes: ["id", "status_name"] },
        ...includes,
      ],
      distinct: true,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    /* =========================
       FILTER COUNTS
    ========================== */

    // 1. Category Counts
    const categoryCounts = await CategoriesModel.findAll({
  attributes: [
    "id",
    "name",
    [fn("COUNT", col("users.id")), "count"],
  ],
  include: [
    {
      model: UserModel,
      attributes: [],
      required: true,

      through: {
        attributes: [], // ✅ REMOVE influencer_categories.id (MAIN FIX)
      },

      include: [
        {
          model: SocialAccountModel,
          attributes: [],
          required: true,
          where: socialWhere,
        },
        {
          model: InfluencerProfileModel,
          attributes: [],
          required: true,
          where: profileWhere,
        },
      ],
    },
  ],
  group: ["categories.id", "categories.name"],
  raw: true,
  subQuery: false,
});

    // 2. Platform Counts
    const platformCounts = await SocialAccountModel.findAll({
      attributes: [
        "platform_id",
        [fn("COUNT", col("user_id")), "count"],
      ],
      where: socialWhere,
      group: ["platform_id"],
    });

    // 3. Price Range Count (optional buckets)
    const priceCounts = await InfluencerProfileModel.findAll({
  attributes: [
    [
      literal(`
        CASE 
          WHEN price_start < 100 THEN 'low'
          WHEN price_start BETWEEN 100 AND 500 THEN 'medium'
          ELSE 'high'
        END
      `),
      "price_range", // ✅ changed alias
    ],
    [fn("COUNT", col("id")), "count"],
  ],
  group: [
    literal(`
      CASE 
        WHEN price_start < 100 THEN 'low'
        WHEN price_start BETWEEN 100 AND 500 THEN 'medium'
        ELSE 'high'
      END
    `),
  ],
});

    return res.status(200).json({
      success: true,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
      filters: {
        categories: categoryCounts,
        platforms: platformCounts,
        price_ranges: priceCounts,
      },
      data: rows,
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
          total_reach:p.total_reach ?? null,
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

      await user.setCategories(category_ids);

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
    const { accounts } = req.body;

    if (!userId || !Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "accounts array is required",
      });
    }

    for (const acc of accounts) {
      if (!acc.platform_id || !acc.username) {
        return res.status(400).json({
          success: false,
          message: "platform_id and username are required for all accounts",
        });
      }
    }

    const existingAccounts = await SocialAccountModel.findAll({
      where: {
        user_id: userId,
      },
    });

    const existingPlatformIds = existingAccounts.map(
      (item) => item.platform_id
    );

    const newAccounts = accounts.filter(
      (acc) => !existingPlatformIds.includes(acc.platform_id)
    );

    if (newAccounts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All social accounts already exist",
      });
    }

    const dataToInsert = newAccounts.map((acc) => ({
      user_id: userId,
      platform_id: acc.platform_id,
      username: acc.username,
      profile_url: acc.profile_url || null,
      followers: acc.followers || 0,
      engagement_rate: acc.engagement_rate || 0,
    }));

    await SocialAccountModel.bulkCreate(dataToInsert);

    return res.status(200).json({
      success: true,
      message: "Social accounts added successfully",
      data: dataToInsert,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
        message: "Social Account Deleted Successfully"
      });

    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔍 Check user exists
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ Delete related data first

    // Influencer Profile
    await InfluencerProfileModel.destroy({
      where: { user_id: userId },
    });

    // Social Accounts
    await SocialAccountModel.destroy({
      where: { user_id: userId },
    });

    // Categories (Many-to-Many)
    await user.setCategories([]);

    // 👉 Audience tables (based on your DB: influencer_id)
    await InfluencerAudienceGenderModel.destroy({
      where: { influencer_id: userId },
    });

    await InfluencerAudienceLocationsModel.destroy({
      where: { influencer_id: userId },
    });

    await InfluencerAudienceAgeModel.destroy({
      where: { influencer_id: userId },
    });

    // 👤 Delete user
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
    getInfluencersList,
    updateInfluencersPlatform,
    updateInfluencerCategories,
    getAllSocialAccounts,
    addSocialAccount,
    updateSocialAccount,
    deleteSocialAccount,
    getSocialAccountById,
    updateInfluencerAudienceGender,
    updateInfluencerAudienceAge,
    updateInfluencerAudienceLocations
  };
};

module.exports = InfluencerController;
