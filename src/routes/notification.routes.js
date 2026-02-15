const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const jwtController = require("../config/jwtVerify");
const { getNotifications } = NotificationController();

router.use(jwtController.protect);
router.get("/get-notifications", getNotifications);

module.exports = router;
