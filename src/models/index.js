const database = require("../config/db");

const UserType = require("./user_type");
const UserStatus = require("./user_status");
const User = require("./user");
const UserStatusLog = require("./user_status_log");
const BrandProfile = require("./brand_profile");
const InfluencerProfile = require("./influencer_profile");
const Wishlist = require("./wishlist");
const WishlistItem = require("./wishlist_item");
const Notification = require("./notification");
const Platform = require("./platform");
const SocialAccount = require("./social_account");
const CategoriesModel = require("./category");
const InfluencerCategory = require("./influencer_category");
const Plan = require("./plan");
const SubscriptionStatus = require("./subscription_status");
const BrandSubscription = require("./brand_subscription");
const CampaignStatus = require("./campaign_status");
const Campaign = require("./campaign");
const ProposalStatus = require("./proposal_status");
const CampaignProposal = require("./campaign_proposal");
const OrderStatus = require("./order_status");
const Order = require("./order");
const OrderStatusLog = require("./order_status_log");
const PaymentStatus = require("./payment_status");
const Payment = require("./payment");

// User module
User.belongsTo(UserType, { foreignKey: "user_type_id" });
User.belongsTo(UserStatus, { foreignKey: "status_id" });
UserType.hasMany(User, { foreignKey: "user_type_id" });
UserStatus.hasMany(User, { foreignKey: "status_id" });

UserStatusLog.belongsTo(User, { foreignKey: "user_id" });
UserStatusLog.belongsTo(UserStatus, { foreignKey: "status_id" });
UserStatusLog.belongsTo(User, { foreignKey: "changed_by", as: "changedByUser" });
User.hasMany(UserStatusLog, { foreignKey: "user_id" });
User.hasMany(UserStatusLog, { foreignKey: "changed_by", as: "statusLogsChangedBy" });

// Profile module
BrandProfile.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(BrandProfile, { foreignKey: "user_id" });
InfluencerProfile.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(InfluencerProfile, { foreignKey: "user_id" });

// Wishlist module (brand_id and influencer_id reference users.id)
Wishlist.belongsTo(User, { foreignKey: "brand_id" });
User.hasMany(Wishlist, { foreignKey: "brand_id" });
WishlistItem.belongsTo(Wishlist, { foreignKey: "wishlist_id" });
WishlistItem.belongsTo(User, { foreignKey: "influencer_id" });
Wishlist.hasMany(WishlistItem, { foreignKey: "wishlist_id" });
User.hasMany(WishlistItem, { foreignKey: "influencer_id" });

// Notification module
Notification.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Notification, { foreignKey: "user_id" });

// Social & Category module
Platform.hasMany(SocialAccount, { foreignKey: "platform_id" });
SocialAccount.belongsTo(Platform, { foreignKey: "platform_id" });
SocialAccount.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(SocialAccount, { foreignKey: "user_id" });

User.belongsToMany(CategoriesModel, {
  through: InfluencerCategory,
  foreignKey: "user_id",
  otherKey: "category_id",
});
CategoriesModel.belongsToMany(User, {
  through: InfluencerCategory,
  foreignKey: "category_id",
  otherKey: "user_id",
});
InfluencerCategory.belongsTo(User, { foreignKey: "user_id" });
InfluencerCategory.belongsTo(CategoriesModel, { foreignKey: "category_id" });

// Subscription module (brand_id → users.id)
Plan.hasMany(BrandSubscription, { foreignKey: "plan_id" });
SubscriptionStatus.hasMany(BrandSubscription, { foreignKey: "status_id" });
BrandSubscription.belongsTo(User, { foreignKey: "brand_id" });
BrandSubscription.belongsTo(Plan, { foreignKey: "plan_id" });
BrandSubscription.belongsTo(SubscriptionStatus, { foreignKey: "status_id" });
User.hasMany(BrandSubscription, { foreignKey: "brand_id" });

// Campaign module (brand_id → users.id)
CampaignStatus.hasMany(Campaign, { foreignKey: "status_id" });
Campaign.belongsTo(User, { foreignKey: "brand_id" });
Campaign.belongsTo(CampaignStatus, { foreignKey: "status_id" });
User.hasMany(Campaign, { foreignKey: "brand_id" });

// Proposal module (User as both brand and influencer)
ProposalStatus.hasMany(CampaignProposal, { foreignKey: "status_id" });
CampaignProposal.belongsTo(Campaign, { foreignKey: "campaign_id" });
CampaignProposal.belongsTo(User, { foreignKey: "influencer_id", as: "influencer" });
CampaignProposal.belongsTo(User, { foreignKey: "brand_id", as: "brand" });
CampaignProposal.belongsTo(ProposalStatus, { foreignKey: "status_id" });
Campaign.hasMany(CampaignProposal, { foreignKey: "campaign_id" });
User.hasMany(CampaignProposal, { foreignKey: "influencer_id", as: "proposalsAsInfluencer" });
User.hasMany(CampaignProposal, { foreignKey: "brand_id", as: "proposalsAsBrand" });

// Order module (User as both brand and influencer)
OrderStatus.hasMany(Order, { foreignKey: "status_id" });
Order.belongsTo(Campaign, { foreignKey: "campaign_id" });
Order.belongsTo(CampaignProposal, { foreignKey: "proposal_id" });
Order.belongsTo(User, { foreignKey: "brand_id", as: "brand" });
Order.belongsTo(User, { foreignKey: "influencer_id", as: "influencer" });
Order.belongsTo(OrderStatus, { foreignKey: "status_id" });
Campaign.hasMany(Order, { foreignKey: "campaign_id" });
CampaignProposal.hasOne(Order, { foreignKey: "proposal_id" });
User.hasMany(Order, { foreignKey: "brand_id", as: "ordersAsBrand" });
User.hasMany(Order, { foreignKey: "influencer_id", as: "ordersAsInfluencer" });

OrderStatusLog.belongsTo(Order, { foreignKey: "order_id" });
OrderStatusLog.belongsTo(OrderStatus, { foreignKey: "status_id" });
OrderStatusLog.belongsTo(User, { foreignKey: "changed_by", as: "changedByUser" });
Order.hasMany(OrderStatusLog, { foreignKey: "order_id" });
User.hasMany(OrderStatusLog, { foreignKey: "changed_by", as: "orderLogsChangedBy" });

// Payment module (User as payer and payee)
PaymentStatus.hasMany(Payment, { foreignKey: "status_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });
Payment.belongsTo(User, { foreignKey: "payer_id", as: "payer" });
Payment.belongsTo(User, { foreignKey: "payee_id", as: "payee" });
Payment.belongsTo(PaymentStatus, { foreignKey: "status_id" });
Order.hasMany(Payment, { foreignKey: "order_id" });
User.hasMany(Payment, { foreignKey: "payer_id", as: "paymentsSent" });
User.hasMany(Payment, { foreignKey: "payee_id", as: "paymentsReceived" });

module.exports = {
  database,
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
};
