const Influencer = require('../models/influencer.model');

exports.getAllInfluencers = async (platform) => {
  const influencers = await Influencer.findAll(platform);

  const influencerIds = influencers.map(i => i.influencer_id);

  const [socials, categories] = await Promise.all([
    Influencer.getAllSocialProfiles(influencerIds),
    Influencer.getAllCategories(influencerIds)
  ]);

  const socialMap = {};
  socials.forEach(s => {
    if (!socialMap[s.influencer_id]) socialMap[s.influencer_id] = [];
    socialMap[s.influencer_id].push(s);
  });

  const categoryMap = {};
  categories.forEach(c => {
    if (!categoryMap[c.influencer_id]) categoryMap[c.influencer_id] = [];
    categoryMap[c.influencer_id].push({
      category_id: c.category_id,
      category_name: c.category_name,
      category_slug: c.category_slug,
      category_image: c.category_image
    });
  });

  return influencers.map(i => ({
    ...i,
    social_profiles: socialMap[i.influencer_id] || [],
    categories: categoryMap[i.influencer_id] || []
  }));
};
