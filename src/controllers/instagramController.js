
const {
    updateAllInstagramAccounts,
    getInstagramJobStatus
} = require("../services/instagramBulkUpdate");

// Start bulk update
exports.updateAllFollowers = async (req, res) => {

    try {

        const status = getInstagramJobStatus();

        if (status.running) {
            return res.status(409).json({
                success: false,
                message: "Instagram update is already running",
                data: status
            });
        }

        // Start background process
        updateAllInstagramAccounts()
            .catch(error => {
                console.error("Instagram job error:", error);
            });

        return res.status(202).json({
            success: true,
            message: "Instagram follower update started successfully",
            note: "The update will continue in the background."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get update progress
exports.getFollowersUpdateStatus = async (req, res) => {

    try {

        return res.status(200).json({
            success: true,
            data: getInstagramJobStatus()
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
