const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const { protect } = require("../config/jwtVerify");

const { getNotifications } = NotificationController();

router.use(protect);
router.get("/get-notifications", getNotifications);

module.exports = router;
