const express = require("express");
const router = express.Router();

const CategoriesController = require("../controllers/category.controller");
const jwtController = require("../config/jwtVerify");
const { getAllCategories } = CategoriesController();

router.use(jwtController.protect);
router.get("/get-all-categories", getAllCategories);

module.exports = router;
