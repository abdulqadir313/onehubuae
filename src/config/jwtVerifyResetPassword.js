const jwt = require("jsonwebtoken");

const getResetPasswordSecret = () => {
  const secret = process.env.JWT_PRIVATE_KEY_RESET_PASSWORD || process.env.JWT_SECRET_RESET_PASSWORD;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_PRIVATE_KEY_RESET_PASSWORD is not set. Add it to your .env file.");
  }
  return secret;
};

const createResetPasswordToken = (payload) => {
  return jwt.sign(
    payload,
    getResetPasswordSecret(),
    { expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN || "15m" }
  );
};

const verifyResetPasswordToken = (req, res, next) => {
  try {
    if (!req.headers?.authorization) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, getResetPasswordSecret());
    req.decodedToken = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid. Please resend reset password email.",
    });
  }
};

module.exports = {
  verifyResetPasswordToken,
  getResetPasswordSecret,
  createResetPasswordToken,
};
