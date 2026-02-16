const bcrypt = require("bcrypt");
const {
  UserModel,
  BrandProfileModel,
  InfluencerProfileModel,
  UserTypeModel,
  UserStatusModel,
} = require("../models");
const database = require("../config/db");
const { createToken } = require("../config/jwtVerify");
const { deleteImage } = require("../handlers/uploadImage");

const SALT_ROUNDS = 10;

const UserController = () => {
  /**
   * @description Register a new user (brand or influencer)
   * @param req
   * @param res
   * @returns Created user with token
   */
  const registerUser = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        country,
        city,
        user_type_id,
        company_name,
        industry,
        website,
        display_name,
        bio,
        price_start,
      } = req.body;

      if (!name || !email || !password || !user_type_id) {
        return res.status(400).json({
          success: false,
          message: "Name, email, password and user_type_id are required.",
        });
      }


      const existing = await UserModel.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const t = await database.transaction();
      try {
        const user = await UserModel.create(
          {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            country: country || null,
            city: city || null,
            user_type_id,
            status_id: 1,
            is_verified: 0,
            is_active: 1,
            bio: bio || null,
          },
          { transaction: t }
        );

        if (user_type_id === 2) {
          await BrandProfileModel.create(
            {
              user_id: user.id,
              company_name: company_name || null,
              industry: industry || null,
              website: website || null,
            },
            { transaction: t }
          );
        } else {
          await InfluencerProfileModel.create(
            {
              user_id: user.id,
              display_name: display_name || null,
              price_start: price_start != null ? price_start : null,
            },
            { transaction: t }
          );
        }

        await t.commit();
        const token = createToken(user);
        const { password: _, ...userData } = user.toJSON();
        return res.status(201).json({
          success: true,
          message: "Registration successful.",
          token,
          data: userData,
        });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Authenticate user and return token
   * @param req
   * @param res
   * @returns Token and user data
   */
  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      const user = await UserModel.findOne({
        where: { email, is_active: 1 },
        include: [
          { model: UserTypeModel, attributes: ["id", "type_name"] },
          { model: UserStatusModel, attributes: ["id", "status_name"] },
          { model: BrandProfileModel, required: false },
          { model: InfluencerProfileModel, required: false },
        ],
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const token = createToken(user);
      const { password: _, ...userData } = user.toJSON();
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        data: userData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Log out the current user
   * @param req
   * @param res
   * @returns Success message
   */
  const logoutUser = async (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  };

  /**
   * @description Get authenticated user's profile
   * @param req
   * @param res
   * @returns User profile with type and status
   */
  const getMyProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include: [
          { model: UserTypeModel, attributes: ["id", "type_name"] },
          { model: UserStatusModel, attributes: ["id", "status_name"] },
          { model: BrandProfileModel, required: false },
          { model: InfluencerProfileModel, required: false },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
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
   * @description Update authenticated user's profile (name, phone, country, city, bio)
   * @param req
   * @param res
   * @returns Updated user profile
   */
  const updateMyProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, country, city, bio } = req.body;

      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const updates = {};
      if (name != null) updates.name = name;
      if (phone != null) updates.phone = phone;
      if (country != null) updates.country = country;
      if (city != null) updates.city = city;
      if (bio != null) updates.bio = bio;

      await user.update(updates);
      const { password: _, ...userData } = user.toJSON();
      return res.status(200).json({
        success: true,
        message: "Profile updated.",
        data: userData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Update profile picture (deletes old image from Cloudinary if present)
   * @param req
   * @param res
   * @returns Updated profile picture URL
   */
  const updateProfilePicture = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      const file = req.file;
      if (!file || !file.path) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded. Send the file in form field 'profile_pic'.",
        });
      }

      if (user.profile_pic) {
        await deleteImage(user.profile_pic);
      }

      await user.update({ profile_pic: file.path });
      const { password: _, ...userData } = user.toJSON();
      return res.status(200).json({
        success: true,
        message: "Profile picture updated.",
        data: { ...userData, profile_pic: file.path },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Change authenticated user's password
   * @param req
   * @param res
   * @returns Success message
   */
  const changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({
          success: false,
          message: "current_password and new_password are required.",
        });
      }

      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      user.password = await bcrypt.hash(new_password, SALT_ROUNDS);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password changed successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Deactivate authenticated user account
   * @param req
   * @param res
   * @returns Success message
   */
  const deleteAccount = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      user.is_active = 0;
      user.status_id = 4;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Account deactivated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile,
    updateMyProfile,
    updateProfilePicture,
    changePassword,
    deleteAccount,
  };
};

module.exports = UserController;
