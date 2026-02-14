const bcrypt = require("bcrypt");
const {
  UserType,
  UserStatus,
  User,
  UserStatusLog,
  BrandProfile,
  InfluencerProfile,
  Wishlist,
  WishlistItem,
  Notification,
  Platform,
  SocialAccount,
  CategoriesModel,
  InfluencerCategory,
  Plan,
  SubscriptionStatus,
  BrandSubscription,
  CampaignStatus,
  Campaign,
  ProposalStatus,
  CampaignProposal,
  OrderStatus,
  Order,
  OrderStatusLog,
  PaymentStatus,
  Payment,
} = require("../models");
const preData = require("../config/preData.json");

const SALT_ROUNDS = 10;

const initiatePreData = async () => {
  await UserType.sync();
  await UserStatus.sync();
  await User.sync();
  await UserStatusLog.sync();
  await BrandProfile.sync();
  await InfluencerProfile.sync();
  await Wishlist.sync();
  await WishlistItem.sync();
  await Notification.sync();
  await Platform.sync();
  await SocialAccount.sync();
  await CategoriesModel.sync();
  await InfluencerCategory.sync();
  await Plan.sync();
  await SubscriptionStatus.sync();
  await BrandSubscription.sync();
  await CampaignStatus.sync();
  await Campaign.sync();
  await ProposalStatus.sync();
  await CampaignProposal.sync();
  await OrderStatus.sync();
  await Order.sync();
  await OrderStatusLog.sync();
  await PaymentStatus.sync();
  await Payment.sync();

  let userTypes = await UserType.findAll();
  if (userTypes.length === 0) {
    await UserType.bulkCreate(preData.user_types);
  }

  let userStatus = await UserStatus.findAll();
  if (userStatus.length === 0) {
    await UserStatus.bulkCreate(preData.user_status);
  }

  let subscriptionStatus = await SubscriptionStatus.findAll();
  if (subscriptionStatus.length === 0) {
    await SubscriptionStatus.bulkCreate(preData.subscription_status);
  }

  let campaignStatus = await CampaignStatus.findAll();
  if (campaignStatus.length === 0) {
    await CampaignStatus.bulkCreate(preData.campaign_status);
  }

  let proposalStatus = await ProposalStatus.findAll();
  if (proposalStatus.length === 0) {
    await ProposalStatus.bulkCreate(preData.proposal_status);
  }

  let orderStatus = await OrderStatus.findAll();
  if (orderStatus.length === 0) {
    await OrderStatus.bulkCreate(preData.order_status);
  }

  let paymentStatus = await PaymentStatus.findAll();
  if (paymentStatus.length === 0) {
    await PaymentStatus.bulkCreate(preData.payment_status);
  }

  let platforms = await Platform.findAll();
  if (platforms.length === 0) {
    await Platform.bulkCreate(preData.platforms);
  }

  let categories = await CategoriesModel.findAll();
  if (categories.length === 0) {
    await CategoriesModel.bulkCreate(preData.categories);
  }

  let plans = await Plan.findAll();
  if (plans.length === 0) {
    await Plan.bulkCreate(preData.plans);
  }

  const users = await User.findAll();
  if (users.length === 0) {
    await User.bulkCreate(preData.users);
  }

  console.info("Pre-data: all tables seeded successfully.");
};

module.exports = initiatePreData;
