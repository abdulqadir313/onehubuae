const { Notification } = require("../models");

const NotificationController = () => {
  /**
   * @description Get notifications for authenticated user
   * @param req
   * @param res
   * @returns List of notifications
   */
  const getNotifications = async (req, res) => {
    try {
      // TODO: list notifications for req.user.id
      const notifications = await Notification.findAll();
      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getNotifications,
  };
};

module.exports = NotificationController;
