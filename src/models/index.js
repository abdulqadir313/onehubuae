const database = require("../config/db");

const UserTypeModel = require("./user_type");
const UserStatusModel = require("./user_status");
const UserModel = require("./user");
const UserStatusLogModel = require("./user_status_log");
const BrandProfileModel = require("./brand_profile");
const InfluencerProfileModel = require("./influencer_profile");
const WishlistModel = require("./wishlist");
const WishlistItemModel = require("./wishlist_item");
const NotificationModel = require("./notification");
const PlatformModel = require("./platform");
const SocialAccountModel = require("./social_account");
const CategoriesModel = require("./category");
const InfluencerCategoryModel = require("./influencer_category");
const PlanModel = require("./plan");
const SubscriptionStatusModel = require("./subscription_status");
const BrandSubscriptionModel = require("./brand_subscription");
const CampaignStatusModel = require("./campaign_status");
const CampaignModel = require("./campaign");
const ProposalStatusModel = require("./proposal_status");
const CampaignProposalModel = require("./campaign_proposal");
const OrderStatusModel = require("./order_status");
const OrderModel = require("./order");
const OrderStatusLogModel = require("./order_status_log");
const PaymentStatusModel = require("./payment_status");
const PaymentModel = require("./payment");

// User module
UserModel.belongsTo(UserTypeModel, { foreignKey: "user_type_id" });
UserModel.belongsTo(UserStatusModel, { foreignKey: "status_id" });
UserTypeModel.hasMany(UserModel, { foreignKey: "user_type_id" });
UserStatusModel.hasMany(UserModel, { foreignKey: "status_id" });

UserStatusLogModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserStatusLogModel.belongsTo(UserStatusModel, { foreignKey: "status_id" });
UserStatusLogModel.belongsTo(UserModel, { foreignKey: "changed_by", as: "changedByUser" });
UserModel.hasMany(UserStatusLogModel, { foreignKey: "user_id" });
UserModel.hasMany(UserStatusLogModel, { foreignKey: "changed_by", as: "statusLogsChangedBy" });

// Profile module
BrandProfileModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasOne(BrandProfileModel, { foreignKey: "user_id" });
InfluencerProfileModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasOne(InfluencerProfileModel, { foreignKey: "user_id" });

// Wishlist module
WishlistModel.belongsTo(UserModel, { foreignKey: "brand_id" });
UserModel.hasMany(WishlistModel, { foreignKey: "brand_id" });
WishlistItemModel.belongsTo(WishlistModel, { foreignKey: "wishlist_id" });
WishlistItemModel.belongsTo(UserModel, { foreignKey: "influencer_id" });
WishlistModel.hasMany(WishlistItemModel, { foreignKey: "wishlist_id" });
UserModel.hasMany(WishlistItemModel, { foreignKey: "influencer_id" });

// Notification module
NotificationModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(NotificationModel, { foreignKey: "user_id" });

// Social & Category module
PlatformModel.hasMany(SocialAccountModel, { foreignKey: "platform_id" });
SocialAccountModel.belongsTo(PlatformModel, { foreignKey: "platform_id" });
SocialAccountModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(SocialAccountModel, { foreignKey: "user_id" });

UserModel.belongsToMany(CategoriesModel, {
  through: InfluencerCategoryModel,
  foreignKey: "user_id",
  otherKey: "category_id",
});
CategoriesModel.belongsToMany(UserModel, {
  through: InfluencerCategoryModel,
  foreignKey: "category_id",
  otherKey: "user_id",
});
InfluencerCategoryModel.belongsTo(UserModel, { foreignKey: "user_id" });
InfluencerCategoryModel.belongsTo(CategoriesModel, { foreignKey: "category_id" });

// Subscription module
PlanModel.hasMany(BrandSubscriptionModel, { foreignKey: "plan_id" });
SubscriptionStatusModel.hasMany(BrandSubscriptionModel, { foreignKey: "status_id" });
BrandSubscriptionModel.belongsTo(UserModel, { foreignKey: "brand_id" });
BrandSubscriptionModel.belongsTo(PlanModel, { foreignKey: "plan_id" });
BrandSubscriptionModel.belongsTo(SubscriptionStatusModel, { foreignKey: "status_id" });
UserModel.hasMany(BrandSubscriptionModel, { foreignKey: "brand_id" });

// Campaign module
CampaignStatusModel.hasMany(CampaignModel, { foreignKey: "status_id" });
CampaignModel.belongsTo(UserModel, { foreignKey: "brand_id" });
CampaignModel.belongsTo(CampaignStatusModel, { foreignKey: "status_id" });
UserModel.hasMany(CampaignModel, { foreignKey: "brand_id" });

// Proposal module
ProposalStatusModel.hasMany(CampaignProposalModel, { foreignKey: "status_id" });
CampaignProposalModel.belongsTo(CampaignModel, { foreignKey: "campaign_id" });
CampaignProposalModel.belongsTo(UserModel, { foreignKey: "influencer_id", as: "influencer" });
CampaignProposalModel.belongsTo(UserModel, { foreignKey: "brand_id", as: "brand" });
CampaignProposalModel.belongsTo(ProposalStatusModel, { foreignKey: "status_id" });
CampaignModel.hasMany(CampaignProposalModel, { foreignKey: "campaign_id" });
UserModel.hasMany(CampaignProposalModel, { foreignKey: "influencer_id", as: "proposalsAsInfluencer" });
UserModel.hasMany(CampaignProposalModel, { foreignKey: "brand_id", as: "proposalsAsBrand" });

// Order module
OrderStatusModel.hasMany(OrderModel, { foreignKey: "status_id" });
OrderModel.belongsTo(CampaignModel, { foreignKey: "campaign_id" });
OrderModel.belongsTo(CampaignProposalModel, { foreignKey: "proposal_id" });
OrderModel.belongsTo(UserModel, { foreignKey: "brand_id", as: "brand" });
OrderModel.belongsTo(UserModel, { foreignKey: "influencer_id", as: "influencer" });
OrderModel.belongsTo(OrderStatusModel, { foreignKey: "status_id" });
CampaignModel.hasMany(OrderModel, { foreignKey: "campaign_id" });
CampaignProposalModel.hasOne(OrderModel, { foreignKey: "proposal_id" });
UserModel.hasMany(OrderModel, { foreignKey: "brand_id", as: "ordersAsBrand" });
UserModel.hasMany(OrderModel, { foreignKey: "influencer_id", as: "ordersAsInfluencer" });

OrderStatusLogModel.belongsTo(OrderModel, { foreignKey: "order_id" });
OrderStatusLogModel.belongsTo(OrderStatusModel, { foreignKey: "status_id" });
OrderStatusLogModel.belongsTo(UserModel, { foreignKey: "changed_by", as: "changedByUser" });
OrderModel.hasMany(OrderStatusLogModel, { foreignKey: "order_id" });
UserModel.hasMany(OrderStatusLogModel, { foreignKey: "changed_by", as: "orderLogsChangedBy" });

// Payment module
PaymentStatusModel.hasMany(PaymentModel, { foreignKey: "status_id" });
PaymentModel.belongsTo(OrderModel, { foreignKey: "order_id" });
PaymentModel.belongsTo(UserModel, { foreignKey: "payer_id", as: "payer" });
PaymentModel.belongsTo(UserModel, { foreignKey: "payee_id", as: "payee" });
PaymentModel.belongsTo(PaymentStatusModel, { foreignKey: "status_id" });
OrderModel.hasMany(PaymentModel, { foreignKey: "order_id" });
UserModel.hasMany(PaymentModel, { foreignKey: "payer_id", as: "paymentsSent" });
UserModel.hasMany(PaymentModel, { foreignKey: "payee_id", as: "paymentsReceived" });

module.exports = {
  database,
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
};
