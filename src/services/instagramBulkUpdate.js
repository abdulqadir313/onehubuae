const { Op } = require("sequelize");
const { SocialAccountModel } = require("../models");
const {scrapeInstagramProfile} = require("./instagramScraper");

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

const getInstagramUsername = (profileUrl, username) => {
    const value = profileUrl || username;
    if (!value) return null;

    return value
        .trim()
        .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
        .replace(/^@/, "")
        .split(/[/?#]/)[0];
};

let isRunning = false;

let jobStatus = {
    running: false,
    total: 0,
    processed: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
    startedAt: null,
    completedAt: null
};

const updateAllInstagramAccounts = async () => {
    if (isRunning) {
        throw new Error("Instagram update is already running");
    }
    isRunning = true;
    jobStatus = {
        running: true,
        total: 0,
        processed: 0,
        updated: 0,
        failed: 0,
        skipped: 0,
        startedAt: new Date(),
        completedAt: null
    };
    try {
        // Fetch all Instagram accounts
        const accounts = await SocialAccountModel.findAll({
            where: {
                platform_id: 1,
                profile_url: {
                    [Op.ne]: null
                }
            },
            attributes: [
                "id",
                "user_id",
                "platform_id",
                "username",
                "profile_url",
                "followers"
            ],
            order: [["id", "ASC"]]
        });
        jobStatus.total = accounts.length;
        console.log(
            `Total Instagram accounts found: ${accounts.length}`
        );
        for (const account of accounts) {
            try {
                const username = getInstagramUsername(
                    account.profile_url,
                    account.username
                );
                if (!username) {
                    jobStatus.skipped++;
                    jobStatus.processed++;
                    continue;
                }
                console.log(
                    `Scraping ${jobStatus.processed + 1}/${accounts.length}: @${username}`
                );
                // Get latest Instagram data
                const result = await scrapeInstagramProfile(username);
                if (
                    !result.success ||
                    result.followers === null ||
                    !Number.isSafeInteger(result.followers) ||
                    result.followers < 0
                ) {
                    jobStatus.failed++;
                    console.log(
                        `Failed: @${username}`,
                        result.error || "Valid follower count unavailable"
                    );
                } else {
                    // Update existing social_accounts record
                    await SocialAccountModel.update(
                        {
                            followers: result.followers
                        },
                        {
                            where: {
                                id: account.id,
                                platform_id: 1
                            }
                        }
                    );
                    jobStatus.updated++;
                    console.log(
                        `Updated @${username}: ${result.followers} followers`
                    );
                }
            } catch (error) {
                jobStatus.failed++;
                console.error(
                    `Account ID ${account.id} failed:`,
                    error.message
                );
            } finally {
                jobStatus.processed++;
            }
            // Conservative delay between Instagram requests
            await sleep(15000);
        }

    } catch (error) {
        console.error(
            "Instagram bulk update error:",
            error
        );
        throw error;
    } finally {
        jobStatus.running = false;
        jobStatus.completedAt = new Date();
        isRunning = false;
        console.log("Instagram bulk update completed", jobStatus);
    }
    return jobStatus;
};

const getInstagramJobStatus = () => jobStatus;

module.exports = {
    updateAllInstagramAccounts,
    getInstagramJobStatus
};
