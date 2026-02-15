const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { USER_TYPES } = require("../utils/constants");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET is not set. Add JWT_SECRET to your .env file.");
  }
  return secret;
};

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, user_type_id: user.user_type_id },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.trim()) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized request. Add header: Authorization: Bearer <token>",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findOne({
      where: { id: decoded.id, is_active: 1 },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Auth token invalid or user inactive.",
      });
    }

    req.user = user.toJSON();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request.",
    });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (req.user.user_type_id === USER_TYPES.SUPER_ADMIN) {
        return next();
      }

      if (roles.includes(req.user.user_type_id)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Role check failed",
      });
    }
  };
};

module.exports = {
  protect,
  getJwtSecret,
  createToken,
  allowRoles,
};
