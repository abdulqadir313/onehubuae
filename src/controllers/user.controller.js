require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-")         // spaces → hyphen
      .replace(/-+/g, "-");         // remove multiple hyphens
  };

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
      const baseName = name;
      let slug = slugify(baseName);

      // ensure unique slug
      let count = 1;
      let uniqueSlug = slug;

      while (true) {
        const existingSlug = await UserModel.findOne({
          where: { slug: uniqueSlug },
          transaction: t,
        });

        if (!existingSlug) break;

        uniqueSlug = `${slug}-${count++}`;
      }
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
            slug: uniqueSlug,
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

  const loginAdminUser = async (req, res) => {
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
          message: "Current password and New password are required.",
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create JWT token (valid for 15 minutes)
    const token = jwt.sign(
      {
        id: user.id,
        type: "reset_password",
      },
      process.env.JWT_PRIVATE_KEY_RESET_PASSWORD, // ✅ same key
      {
        expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN, // ✅ 15m
      }
    );

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "OneHub - UAE Reset Password",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 25px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#c9a227; padding:35px 30px; text-align:center; color:#ffffff;">
              <img src="https://onehub.ae/wp-content/uploads/2023/10/One-Hub-Logo.webp" width="70" style="margin-bottom:15px;"/>
              <h2 style="margin:0; font-size:22px; font-weight:600;">
                Reset Your Password Securely
              </h2>
              <p style="margin-top:10px; font-size:14px; opacity:0.9;">
                We’ll send you a secure link to reset your password.<br/>
                The link will expire in 15 minutes.
              </p>

            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333;">
              <p style="font-size:15px; margin:0 0 15px;">
                Hi <strong>${user.name || "User"}</strong>,
              </p>
              <p style="font-size:14px; line-height:1.6; margin-bottom:25px;">
                We received a request to reset your password. Click the button below to create a new one.
              </p>
              <div style="text-align:center; margin-bottom:25px;">
                <a href="${resetURL}"
                   style="background:#c9a227; color:#ffffff; padding:12px 28px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; display:inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size:13px; color:#666; line-height:1.6;">
                If you didn’t request this, you can safely ignore this email.
              </p>
              <p style="font-size:12px; color:#999; word-break:break-all; margin-top:15px;">
                Or copy this link:<br/>
                <a href="${resetURL}" style="color:#c9a227;">${resetURL}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa; text-align:center; padding:20px; font-size:12px; color:#888;">
              © 2026 OneHub. All rights reserved.<br/><br/>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="18"/></a>
              <a href="#" style="margin:0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="18"/></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="18"/></a>
              <a href="#"><img style="margin:0 8px;" src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="18"/></a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    }).catch(err => console.log("Email error:", err));

    return res.status(200).json({
      success: true,
      message: "Reset link sent on registered email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  });
  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};





const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY_RESET_PASSWORD
      );
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    if (decoded.type !== "reset_password") {
      return res.status(400).json({
        success: false,
        message: "Invalid token type",
      });
    }
    const user = await UserModel.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
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
    loginAdminUser,
    logoutUser,
    getMyProfile,
    updateMyProfile,
    updateProfilePicture,
    changePassword,
    deleteAccount,
    forgotPassword,
    resetPassword,
  };
};

module.exports = UserController;
