const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const jwtController = require("../config/jwtVerify");

const { getOrders } = OrderController();

router.use(jwtController.protect);
router.get("/get-orders", getOrders);

module.exports = router;
