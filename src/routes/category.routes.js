const express = require("express");
const router = express.Router();

const CategoriesController = require("../controllers/category.controller");
const jwtController = require("../config/jwtVerify");
const { getAllCategories , addCategory, updateCategory, deleteCategory, getCategoryById} = CategoriesController();

router.get("/get-all-categories", getAllCategories);
router.use(jwtController.protect);
router.post("/add-category" , addCategory)
router.put("/update-category" , updateCategory)
router.delete("/delete-category" , deleteCategory)
router.get("/get-category-by-id", getCategoryById);


module.exports = router;
