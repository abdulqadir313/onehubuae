const database = require("../config/db");

const Brand = require("./brand");
const Campaign = require("./campaign");
const CategoriesModel = require("./category");
const ContentType = require("./content_type");
const InfluencerModel = require("./influencer");
const InfluencerCampaign = require("./influencer_campaign");
const InfluencerCategory = require("./influencer_category");
const Payment = require("./payment");
const Review = require("./review");
const SocialProfile = require("./social_profile");
const Platform = require("./platform");

// Brand <-> Campaign
Brand.hasMany(Campaign, { foreignKey: "brand_id" });
Campaign.belongsTo(Brand, { foreignKey: "brand_id" });

// Campaign <-> InfluencerCampaign
Campaign.hasMany(InfluencerCampaign, { foreignKey: "campaign_id" });
InfluencerCampaign.belongsTo(Campaign, { foreignKey: "campaign_id" });

// Influencer <-> InfluencerCampaign
InfluencerModel.hasMany(InfluencerCampaign, { foreignKey: "influencer_id" });
InfluencerCampaign.belongsTo(InfluencerModel, { foreignKey: "influencer_id" });

// Influencer <-> Category (many-to-many through InfluencerCategory)
InfluencerModel.belongsToMany(CategoriesModel, {
  through: InfluencerCategory,
  foreignKey: "influencer_id",
  otherKey: "category_id",
});
CategoriesModel.belongsToMany(InfluencerModel, {
  through: InfluencerCategory,
  foreignKey: "category_id",
  otherKey: "influencer_id",
});

Platform.hasMany(SocialProfile, { 
  foreignKey: "platform_id",
  as: "social_profiles"
});

SocialProfile.belongsTo(Platform, { 
  foreignKey: "platform_id",
  as: "platform"
});

// InfluencerCategory junction references
InfluencerCategory.belongsTo(InfluencerModel, { foreignKey: "influencer_id" });
InfluencerCategory.belongsTo(CategoriesModel, { foreignKey: "category_id" });

// Influencer <-> SocialProfile
InfluencerModel.hasMany(SocialProfile, { foreignKey: "influencer_id" });
SocialProfile.belongsTo(InfluencerModel, { foreignKey: "influencer_id" });

// InfluencerCampaign <-> Payment
InfluencerCampaign.hasMany(Payment, { foreignKey: "influencer_campaign_id" });
Payment.belongsTo(InfluencerCampaign, { foreignKey: "influencer_campaign_id" });

// InfluencerCampaign <-> Review
InfluencerCampaign.hasMany(Review, { foreignKey: "influencer_campaign_id" });
Review.belongsTo(InfluencerCampaign, { foreignKey: "influencer_campaign_id" });

module.exports = {
  database,
  Brand,
  Campaign,
  CategoriesModel,
  ContentType,
  InfluencerModel,
  InfluencerCampaign,
  InfluencerCategory,
  Payment,
  Review,
  SocialProfile,
  Platform
};
