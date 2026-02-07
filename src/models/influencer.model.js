const db = require('../config/db');

class Influencer {

  static async findAll(platform = null) {
    let sql = `
      SELECT DISTINCT i.influencer_id, i.full_name, i.bio, i.city, i.country, i.profile_pic
      FROM influencers i
    `;

    const params = [];

    if (platform) {
      sql += `
        JOIN social_profiles sp 
          ON sp.influencer_id = i.influencer_id
        WHERE sp.platform = ?
      `;
      params.push(platform);
    }

    sql += ` ORDER BY i.influencer_id DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async getAllSocialProfiles(influencerIds) {
    if (!influencerIds.length) return [];

    const [rows] = await db.query(
      `SELECT influencer_id, platform, username, profile_url, followers, engagement_rate
       FROM social_profiles
       WHERE influencer_id IN (?)`,
      [influencerIds]
    );
    return rows;
  }

  static async getAllCategories(influencerIds) {
    if (!influencerIds.length) return [];

    const [rows] = await db.query(
      `SELECT ic.influencer_id, c.category_id, c.category_name, c.category_slug, c.category_image
       FROM influencer_categories ic
       JOIN categories c ON c.category_id = ic.category_id
       WHERE c.is_active = 1
         AND ic.influencer_id IN (?)`,
      [influencerIds]
    );
    return rows;
  }
}

module.exports = Influencer;
