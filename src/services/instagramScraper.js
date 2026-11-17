
const { chromium } = require("playwright");

const extractInstagramData = (html) => {
    let followers = null;
    let profilePic = null;

    const followerPatterns = [
        /"edge_followed_by"\s*:\s*\{"count"\s*:\s*(\d+)/,
        /"follower_count"\s*:\s*(\d+)/,
        /"followers_count"\s*:\s*(\d+)/
    ];

    for (const pattern of followerPatterns) {
        const match = html.match(pattern);

        if (match) {
            followers = Number(match[1]);
            break;
        }
    }

    const imagePatterns = [
        /"profile_pic_url_hd"\s*:\s*"([^"]+)"/,
        /"profile_pic_url"\s*:\s*"([^"]+)"/
    ];

    for (const pattern of imagePatterns) {
        const match = html.match(pattern);

        if (match) {
            profilePic = match[1]
                .replace(/\\u0026/g, "&")
                .replace(/\\\//g, "/");
            break;
        }
    }

    return {
        followers,
        profilePic
    };
};

const scrapeInstagramProfile = async (username) => {
    let browser;

    try {
        browser = await chromium.launch({
            headless: true
        });

        const context = await browser.newContext({
            viewport: {
                width: 1280,
                height: 900
            },
            locale: "en-US"
        });

        const page = await context.newPage();

        const url =
            `https://www.instagram.com/${encodeURIComponent(username)}/`;

        const response = await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 45000
        });

        if (!response || !response.ok()) {
            throw new Error(
                `Instagram returned HTTP ${response?.status()}`
            );
        }

        const html = await page.content();

        if (
            html.includes("challenge_required") ||
            html.includes("loginForm") ||
            /accounts\/login/i.test(page.url())
        ) {
            throw new Error(
                "Instagram login or verification required"
            );
        }

        const extracted = extractInstagramData(html);

        const ogImage = await page
            .locator('meta[property="og:image"]')
            .getAttribute("content")
            .catch(() => null);

        return {
            username,
            followers: extracted.followers,
            profilePic: extracted.profilePic || ogImage,
            success: true
        };

    } catch (error) {
        return {
            username,
            success: false,
            error: error.message
        };

    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = {
    scrapeInstagramProfile
};
