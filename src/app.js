const express = require('express');
const cors = require('cors');

const categoryRoutes = require('./routes/category.routes');
const influencerRoutes = require('./routes/influencer.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/influencers', influencerRoutes);

module.exports = app;
