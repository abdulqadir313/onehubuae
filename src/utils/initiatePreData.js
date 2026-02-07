const CategoriesModel = require("../models/category");
const ContentTypeModel = require("../models/content_type");
const InfluencerModel = require("../models/influencer");
const PlatformModel = require("../models/platform");
const InfluencerCampaignModel = require("../models/influencer_campaign");
const InfluencerCategoryModel = require("../models/influencer_category");
const PaymentModel = require("../models/payment");
const ReviewModel = require("../models/review");
const SocialProfileModel = require("../models/social_profile");
const preData = require("../config/preData.json");

const initiatePreData = async () => {

  await CategoriesModel.sync();
  await ContentTypeModel.sync();
  await InfluencerModel.sync();
  await PlatformModel.sync();
  await InfluencerCampaignModel.sync();
  await InfluencerCategoryModel.sync();
  await PaymentModel.sync();
  await ReviewModel.sync();
  await SocialProfileModel.sync();

  let categories = await CategoriesModel.findAll();
  if (categories.length === 0) {
    await CategoriesModel.bulkCreate(preData.categories);
  }

  let contentTypes = await ContentTypeModel.findAll();
  if (contentTypes.length === 0) {
    await ContentTypeModel.bulkCreate(preData.content_types);
  }

  let influencers = await InfluencerModel.findAll();
  if (influencers.length === 0) {
    await InfluencerModel.bulkCreate(preData.influencers);
  }

  let platforms = await PlatformModel.findAll();
  if (platforms.length === 0) {
    await PlatformModel.bulkCreate(preData.platforms);
  }

  // let influencerCampaigns = await InfluencerCampaignModel.findAll();
  // if (influencerCampaigns.length === 0) {
  //   await InfluencerCampaignModel.bulkCreate(preData.influencer_campaigns);
  // }

  // let influencerCategories = await InfluencerCategoryModel.findAll();
  // if (influencerCategories.length === 0) {
  //   await InfluencerCategoryModel.bulkCreate(preData.influencer_categories);
  // }

  // let payments = await PaymentModel.findAll();
  // if (payments.length === 0) {
  //   await PaymentModel.bulkCreate(preData.payments);
  // }

  // let reviews = await ReviewModel.findAll();
  // if (reviews.length === 0) {
  //   await ReviewModel.bulkCreate(preData.reviews);
  // }

  let socialProfiles = await SocialProfileModel.findAll();
  if (socialProfiles.length === 0) {
    await SocialProfileModel.bulkCreate(preData.social_profiles);
  }

  console.info("Pre-data: all tables seeded successfully.");
};

module.exports = initiatePreData;
