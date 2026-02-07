/**
 * Import Route files and set in express middleware
 */

const influencerRoutes = require('../routes/influencer.routes');
const categoryRoutes = require('../routes/category.routes');

exports.set_routes = (app) => {
  app.use('/api/influencers', influencerRoutes);
  app.use('/api/categories', categoryRoutes);
};
