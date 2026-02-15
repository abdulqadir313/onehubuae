const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlist.controller");
const jwtController = require("../config/jwtVerify");
const { USER_TYPES } = require("../utils/constants");

const {
  createWishlist,
  updateWishlist,
  getWishlists,
  getWishlistById,
} = WishlistController();

router.use(jwtController.protect);
router.use(jwtController.allowRoles(USER_TYPES.BRAND));
router.post("/create-wishlist", createWishlist);
router.put("/update-wishlist", updateWishlist);
router.get("/get-wishlists", getWishlists);
router.get("/get-wishlist", getWishlistById);

module.exports = router;
