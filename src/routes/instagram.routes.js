
const express = require("express");

const router = express.Router();

const {
    updateAllFollowers,
    getFollowersUpdateStatus
} = require("../controllers/instagramController");

// Protect these endpoints using your admin authentication
router.post(
    "/update-all-followers",
    updateAllFollowers
);

router.get(
    "/update-status",
    getFollowersUpdateStatus
);

module.exports = router;
