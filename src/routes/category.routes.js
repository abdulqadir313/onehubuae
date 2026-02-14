const express = require("express");
const router = express.Router();

const CategoriesController = require("../controllers/category.controller");

const { getAllCategories } = CategoriesController();

router.get("/", getAllCategories);

module.exports = router;
