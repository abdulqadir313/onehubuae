const express = require("express");
const router = express.Router();
const PlanController = require("../controllers/plan.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");

const {
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
} = PlanController();

router.get("/get-active-plans", getActivePlans);
router.get("/get-plan-details", getPlanDetails);

router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.BRAND));
router.get("/my-current-plan", getMyCurrentPlan);
router.post("/buy-plan", buyPlan);
router.post("/upgrade-plan", upgradePlan);
router.post("/downgrade-plan", downgradePlan);
router.post("/cancel-plan", cancelPlan);
router.get("/my-subscription-history", getMySubscriptionHistory);
router.post("/renew-plan", renewPlan);
router.get("/invoice", getInvoice);

module.exports = router;
