/**
 * Check if logged-in user has required user type
 * Usage: if (checkUserType(req, res, USER_TYPES.BRAND)) return;
 */

const USER_TYPES = {
  BRAND: 2,
  INFLUENCER: 3,
};

const checkUserType = (req, res, requiredType) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
      return true;
    }

    if (req.user.user_type_id === requiredType) {
      return false; // allowed
    }

    res.status(403).json({
      success: false,
      message: "Access denied for this user type",
    });

    return true;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User type check failed",
    });
    return true;
  }
};

module.exports = { checkUserType, USER_TYPES };
