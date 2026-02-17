const { OrderModel, OrderStatusModel } = require("../models");

const OrderController = () => {
  /**
   * @description Get orders for authenticated user
   * @param req
   * @param res
   * @returns List of orders with status
   */
  const getOrders = async (req, res) => {
    try {
      // TODO: list orders (filter by req.user)
      const orders = await Order.findAll({
        include: [{ model: OrderStatus, attributes: ["id", "status_name"] }],
      });
      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getOrders,
  };
};

module.exports = OrderController;