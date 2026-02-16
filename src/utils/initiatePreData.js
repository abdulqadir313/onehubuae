const bcrypt = require("bcrypt");
const {
  UserTypeModel,
  UserStatusModel,
  UserModel,
  UserStatusLogModel,
  BrandProfileModel,
  InfluencerProfileModel,
  WishlistModel,
  WishlistItemModel,
  NotificationModel,
  PlatformModel,
  SocialAccountModel,
  CategoriesModel,
  InfluencerCategoryModel,
  PlanModel,
  SubscriptionStatusModel,
  BrandSubscriptionModel,
  CampaignStatusModel,
  CampaignModel,
  ProposalStatusModel,
  CampaignProposalModel,
  OrderStatusModel,
  OrderModel,
  OrderStatusLogModel,
  PaymentStatusModel,
  PaymentModel,
} = require("../models");
const preData = require("../config/preData.json");

const SALT_ROUNDS = 10;

const initiatePreData = async () => {
  await UserTypeModel.sync();
  await UserStatusModel.sync();
  await UserModel.sync();
  await UserStatusLogModel.sync();
  await BrandProfileModel.sync();
  await InfluencerProfileModel.sync();
  await WishlistModel.sync();
  await WishlistItemModel.sync();
  await NotificationModel.sync();
  await PlatformModel.sync();
  await SocialAccountModel.sync();
  await CategoriesModel.sync();
  await InfluencerCategoryModel.sync();
  await PlanModel.sync();
  await SubscriptionStatusModel.sync();
  await BrandSubscriptionModel.sync();
  await CampaignStatusModel.sync();
  await CampaignModel.sync();
  await ProposalStatusModel.sync();
  await CampaignProposalModel.sync();
  await OrderStatusModel.sync();
  await OrderModel.sync();
  await OrderStatusLogModel.sync();
  await PaymentStatusModel.sync();
  await PaymentModel.sync();

  let userTypes = await UserTypeModel.findAll();
  if (userTypes.length === 0) {
    await UserTypeModel.bulkCreate(preData.user_types);
  }

  let userStatus = await UserStatusModel.findAll();
  if (userStatus.length === 0) {
    await UserStatusModel.bulkCreate(preData.user_status);
  }

  let subscriptionStatus = await SubscriptionStatusModel.findAll();
  if (subscriptionStatus.length === 0) {
    await SubscriptionStatusModel.bulkCreate(preData.subscription_status);
  }

  let campaignStatus = await CampaignStatusModel.findAll();
  if (campaignStatus.length === 0) {
    await CampaignStatusModel.bulkCreate(preData.campaign_status);
  }

  let proposalStatus = await ProposalStatusModel.findAll();
  if (proposalStatus.length === 0) {
    await ProposalStatusModel.bulkCreate(preData.proposal_status);
  }

  let orderStatus = await OrderStatusModel.findAll();
  if (orderStatus.length === 0) {
    await OrderStatusModel.bulkCreate(preData.order_status);
  }

  let paymentStatus = await PaymentStatusModel.findAll();
  if (paymentStatus.length === 0) {
    await PaymentStatusModel.bulkCreate(preData.payment_status);
  }

  let platforms = await PlatformModel.findAll();
  if (platforms.length === 0) {
    await PlatformModel.bulkCreate(preData.platforms);
  }

  let categories = await CategoriesModel.findAll();
  if (categories.length === 0) {
    await CategoriesModel.bulkCreate(preData.categories);
  }

  let plans = await PlanModel.findAll();
  if (plans.length === 0) {
    await PlanModel.bulkCreate(preData.plans);
  }

  const users = await UserModel.findAll();
  if (users.length === 0) {
    await UserModel.bulkCreate(preData.users);
  }

  console.info("Pre-data: all tables seeded successfully.");
};

module.exports = initiatePreData;
