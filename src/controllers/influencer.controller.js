const { Op } = require('sequelize');
const InfluencerModel = require('../models/influencer');
const SocialProfileModel = require('../models/social_profile');
const Platform = require('../models/platform');
const CategoriesModel = require('../models/category');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
      const { platform_id, category_id } = req.body;

      if (!platform_id) {
        return res.status(200).json({
          success: false,
          message: 'platform_id is required',
        });
      }

      const category_ids = category_id.map(id => parseInt(id, 10));
      console.log(category_ids);

      const includes = [
        {
          model: SocialProfileModel,
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

      const influencers = await InfluencerModel.findAll({
        include: includes,
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
  };
  
  const addInfluencer = async (req, res) => {
    
    try {
      const {
        full_name,
        email,
        password,
        bio,
        categories = [],
        social_profiles = []
      } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, Email and Password are required.',
        });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const influencer = await InfluencerModel.create({
        full_name,
        email,
        password: hashedPassword,
        bio,
      });

      if (social_profiles.length > 0) {
        const profilesData = social_profiles.map(profile => ({
          influencer_id: influencer.id,
          platform_id: profile.platform_id,
          username: profile.username,
          profile_url: profile.profile_url,
          followers: profile.followers || 0,
          engagement_rate: profile.engagement_rate || 0,
        }));

        await SocialProfileModel.bulkCreate(profilesData);
      }

      if (categories.length > 0) {
        await influencer.setCategories(categories);
      }

      res.status(201).json({
        success: true,
        message: 'Influencer added successfully',
        data: influencer,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }
   
    const influencer = await InfluencerModel.findOne({
      where: { email },
      include: [
        {
          model: SocialProfileModel,
          attributes: ["id", "username", "profile_url", "followers", "engagement_rate"],
          include: [
            {
              model: Platform,
              as: 'platform',
              attributes: ['id', 'name', 'image_url'],
              where: { is_active: 1 }, 
              required: false
            }
          ]
        },
        {
          model: CategoriesModel,
          attributes: ["id", "name", "slug", "image"],
          through: { attributes: [] }, 
        },
      ],
    });
    const token = jwt.sign(
      {
        id: influencer.id,
        email: influencer.email,
        role: "influencer"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );
    if (!influencer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, influencer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const { password: pwd, ...influencerData } = influencer.toJSON();
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      data: influencer,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  const getInfluencerProfile = async (req, res) => {
  try {
    // ID comes from JWT middleware
    const influencerId = req.user.id;

    const influencer = await InfluencerModel.findOne({
      where: { id: influencerId },
      attributes: [
        "id",
        "full_name",
        "email",
        "phone",
        "country",
        "city",
        "profile_pic",
        "bio",
        "createdAt"
      ],
      include: [
        {
          model: SocialProfileModel,
          as: "social_profiles",
          attributes: [
            "id",
            "username",
            "profile_url",
            "followers",
            "engagement_rate"
          ],
          include: [
            {
              model: Platform,
              as: "platform",
              attributes: ["name"]
            }
          ]
        },
        {
          model: CategoriesModel,
          as: "categories",
          attributes: ["id", "name", "slug", "image"],
          through: { attributes: [] }
        }
      ]
    });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: influencer
    });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const influencer = await InfluencerModel.findOne({
      where: { email }
    });

    if (!influencer) {
      return res.status(400).json({
        success: false,
        message: "Email not found"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    influencer.reset_token = resetToken;
    influencer.reset_token_expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await influencer.save();

    // In production send email here
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    return res.status(200).json({
      success: true,
      message: "Reset link generated",
      reset_link: resetLink // remove in production
    });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };


const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    const influencer = await InfluencerModel.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: {
          [Op.gt]: Date.now()
        }
      }
    });

    if (!influencer) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    influencer.password = hashedPassword;
    influencer.reset_token = null;
    influencer.reset_token_expiry = null;

    await influencer.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  const updateInfluencerProfile = async (req, res) => {
    try {
      const influencerId = req.user?.id;
      if (!influencerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const influencer = await InfluencerModel.findByPk(influencerId);
      if (!influencer) {
        return res.status(403).json({
          success: false,
          message: "User is not an influencer",
        });
      }

      if (!req.file || !req.file.path) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      const profilePicUrl = req.file.path;
      await influencer.update({ profile_pic: profilePicUrl });

      return res.status(200).json({
        success: true,
        message: "Profile picture updated",
        data: { profile_pic: profilePicUrl },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getInfluencersByPlatformId,
    addInfluencer,
    login,
    logout,
    getInfluencerProfile,
    forgotPassword,
    resetPassword,
    updateInfluencerProfile,
  };
};

module.exports = InfluencerController;