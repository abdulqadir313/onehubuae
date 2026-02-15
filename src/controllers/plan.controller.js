const { Plan, BrandSubscription, SubscriptionStatus } = require("../models");

// Subscription status IDs (match preData order: active, expired, cancelled, pending, upgraded, scheduled)
const SUB_ACTIVE = 1;
const SUB_EXPIRED = 2;
const SUB_CANCELLED = 3;
const SUB_UPGRADED = 5;
const SUB_SCHEDULED = 6;

const subscriptionInclude = [
  { model: Plan },
  { model: SubscriptionStatus, attributes: ["id", "status_name"] },
];

const PlanController = () => {
  /**
   * @description Get all active plans (public)
   */
  const getActivePlans = async (req, res) => {
    try {
      const plans = await Plan.findAll({
        where: { is_active: 1 },
      });
      return res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get plan details by id (public). Id from req.query
   */
  const getPlanDetails = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "id is required (query).",
        });
      }
      const plan = await Plan.findOne({
        where: { id, is_active: 1 },
      });
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }
      return res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get current active subscription for the brand (is_current=1, status=active)
   */
  const getMyCurrentPlan = async (req, res) => {
    try {
      const userId = req.user.id;
      const subscription = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
        include: subscriptionInclude,
      });
      if (!subscription) {
        return res.status(200).json({
          success: true,
          data: null,
          message: "No active subscription.",
        });
      }
      return res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Buy a plan – create new subscription. Fails if brand already has active.
   */
  const buyPlan = async (req, res) => {
    try {
      const userId = req.user.id;
      const { plan_id, amount_paid, payment_id } = req.body;

      if (!plan_id) {
        return res.status(400).json({
          success: false,
          message: "plan_id is required.",
        });
      }

      const existing = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Brand already has an active subscription. Use upgrade or cancel first.",
        });
      }

      const plan = await Plan.findOne({ where: { id: plan_id, is_active: 1 } });
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }

      const durationDays = plan.duration_days || 30;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);

      const subscription = await BrandSubscription.create({
        brand_id: userId,
        plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
        status_id: SUB_ACTIVE,
        auto_renew: 0,
        is_current: 1,
        amount_paid: amount_paid != null ? amount_paid : plan.price,
        payment_id: payment_id || null,
        duration_days: durationDays,
        plan_name_snapshot: plan.name || null,
        cancel_at_period_end: 0,
      });

      const withPlan = await BrandSubscription.findByPk(subscription.id, {
        include: subscriptionInclude,
      });
      return res.status(201).json({
        success: true,
        message: "Plan purchased.",
        data: withPlan,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Upgrade to higher plan (immediate). Old subscription marked upgraded, new one current.
   */
  const upgradePlan = async (req, res) => {
    try {
      const userId = req.user.id;
      const { plan_id, amount_paid, payment_id } = req.body;

      if (!plan_id) {
        return res.status(400).json({
          success: false,
          message: "plan_id is required.",
        });
      }

      const current = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
      });

      const plan = await Plan.findOne({ where: { id: plan_id, is_active: 1 } });
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }

      const durationDays = plan.duration_days || 30;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);

      if (current) {
        await current.update({ is_current: 0, status_id: SUB_UPGRADED });
      }

      const subscription = await BrandSubscription.create({
        brand_id: userId,
        plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
        status_id: SUB_ACTIVE,
        auto_renew: current ? current.auto_renew : 0,
        is_current: 1,
        amount_paid: amount_paid != null ? amount_paid : plan.price,
        payment_id: payment_id || null,
        duration_days: durationDays,
        plan_name_snapshot: plan.name || null,
        cancel_at_period_end: 0,
        upgraded_from_subscription_id: current ? current.id : null,
      });

      const withPlan = await BrandSubscription.findByPk(subscription.id, {
        include: subscriptionInclude,
      });
      return res.status(200).json({
        success: true,
        message: "Plan upgraded.",
        data: withPlan,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Downgrade to lower plan (scheduled at current period end). Does not apply immediately.
   */
  const downgradePlan = async (req, res) => {
    try {
      const userId = req.user.id;
      const { plan_id } = req.body;

      if (!plan_id) {
        return res.status(400).json({
          success: false,
          message: "plan_id is required.",
        });
      }

      const current = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
      });
      if (!current) {
        return res.status(404).json({
          success: false,
          message: "No active subscription to downgrade.",
        });
      }

      const plan = await Plan.findOne({ where: { id: plan_id, is_active: 1 } });
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }

      const durationDays = plan.duration_days || 30;
      const startDate = new Date(current.end_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);

      const scheduled = await BrandSubscription.create({
        brand_id: userId,
        plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
        status_id: SUB_SCHEDULED,
        auto_renew: current.auto_renew,
        is_current: 0,
        duration_days: durationDays,
        plan_name_snapshot: plan.name || null,
        cancel_at_period_end: 0,
      });

      const withPlan = await BrandSubscription.findByPk(scheduled.id, {
        include: subscriptionInclude,
      });
      return res.status(201).json({
        success: true,
        message:
          "Downgrade scheduled. New plan starts after current period ends.",
        data: withPlan,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Cancel subscription at period end. Sets cancel_at_period_end=1; remains active till end_date.
   */
  const cancelPlan = async (req, res) => {
    try {
      const userId = req.user.id;

      const subscription = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
      });
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription to cancel.",
        });
      }

      await subscription.update({ cancel_at_period_end: 1 });
      const updated = await BrandSubscription.findByPk(subscription.id, {
        include: subscriptionInclude,
      });
      return res.status(200).json({
        success: true,
        message:
          "Subscription will cancel at period end. Active until " +
          subscription.end_date,
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get all subscriptions for the brand (history).
   */
  const getMySubscriptionHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const subscriptions = await BrandSubscription.findAll({
        where: { brand_id: userId },
        order: [["createdAt", "DESC"]],
        include: subscriptionInclude,
      });
      return res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Renew current subscription – extend end_date by duration_days.
   */
  const renewPlan = async (req, res) => {
    try {
      const userId = req.user.id;

      const subscription = await BrandSubscription.findOne({
        where: { brand_id: userId, is_current: 1, status_id: SUB_ACTIVE },
        include: [{ model: Plan }],
      });
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription to renew.",
        });
      }

      const durationDays =
        subscription.duration_days ||
        (subscription.Plan && subscription.Plan.duration_days) ||
        30;
      const baseDate =
        new Date(subscription.end_date) > new Date()
          ? new Date(subscription.end_date)
          : new Date();
      const endDate = new Date(baseDate);
      endDate.setDate(endDate.getDate() + durationDays);

      await subscription.update({ end_date: endDate });
      const updated = await BrandSubscription.findByPk(subscription.id, {
        include: subscriptionInclude,
      });
      return res.status(200).json({
        success: true,
        message: "Subscription renewed.",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get invoice for a subscription. Id from req.query (subscription id).
   */
  const getInvoice = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "id is required (query).",
        });
      }
      const subscription = await BrandSubscription.findOne({
        where: { id, brand_id: userId },
        include: subscriptionInclude,
      });
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription not found.",
        });
      }
      return res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getActivePlans,
    getPlanDetails,
    getMyCurrentPlan,
    buyPlan,
    upgradePlan,
    downgradePlan,
    cancelPlan,
    getMySubscriptionHistory,
    renewPlan,
    getInvoice,
  };
};

module.exports = PlanController;
