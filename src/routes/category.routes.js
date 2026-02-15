const express = require("express");
const router = express.Router();

const CategoriesController = require("../controllers/category.controller");

const { getAllCategories } = CategoriesController();

router.get("/get-all-categories", getAllCategories);

module.exports = router;
