/**
 * Import Route files and set in express middleware
 */

const userRoutes = require("../routes/user.routes");
const brandRoutes = require("../routes/brand.routes");
const influencerRoutes = require("../routes/influencer.routes");
const categoryRoutes = require("../routes/category.routes");
const campaignRoutes = require("../routes/campaign.routes");
const orderRoutes = require("../routes/order.routes");
const wishlistRoutes = require("../routes/wishlist.routes");
const notificationRoutes = require("../routes/notification.routes");
const planRoutes = require("../routes/plan.routes");
const platformRoutes = require("../routes/platform.routes");


exports.set_routes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/influencers", influencerRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/campaigns", campaignRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/wishlists", wishlistRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/plans", planRoutes);
   app.use("/api/platform", platformRoutes);
};
