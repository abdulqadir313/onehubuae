const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const { protect } = require("../config/jwtVerify");

const { getOrders } = OrderController();

router.use(protect);
router.get("/get-orders", getOrders);

module.exports = router;
