const { WishlistModel, WishlistItemModel, UserModel, InfluencerProfileModel } = require("../models");

const WishlistController = () => {
  /**
   * @description Create a wishlist for the brand
   * @param req
   * @param res
   * @returns Created wishlist
   */
  const createWishlist = async (req, res) => {
    try {
      const userId = req.user.id;
      const { wishlist_name } = req.body;

      if (!wishlist_name) {
        return res.status(400).json({
          success: false,
          message: "wishlist_name is required.",
        });
      }
      
      const wishlist = await WishlistModel.create({
        brand_id: userId,
        wishlist_name: wishlist_name || null,
      });
      return res.status(201).json({
        success: true,
        message: "Wishlist created.",
        data: wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Add one influencer to a wishlist (if not already added)
   * @param req
   * @param res
   * @returns Created wishlist item or message that influencer already added
   */
  const updateWishlist = async (req, res) => {
    try {
      const userId = req.user.id;
      const { wishlist_id, influencer_id } = req.body;

      if (!wishlist_id || !influencer_id) {
        return res.status(400).json({
          success: false,
          message: "wishlist_id and influencer_id are required.",
        });
      }

      const wishlist = await WishlistModel.findOne({
        where: { id: wishlist_id, brand_id: userId },
      });
      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "Wishlist not found.",
        });
      }

      const existing = await WishlistItemModel.findOne({
        where: { wishlist_id, influencer_id },
      });
      if (existing) {
        return res.status(200).json({
          success: false,
          message: "Influencer is already added to this wishlist.",
        });
      }

      await WishlistItemModel.create({ wishlist_id, influencer_id });

      return res.status(201).json({
        success: true,
        message: "Influencer added to wishlist.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get all wishlists for the brand
   * @param req
   * @param res
   * @returns List of wishlists (with item count or items)
   */
  const getWishlists = async (req, res) => {
    try {
      const userId = req.user.id;

      const wishlists = await WishlistModel.findAll({
        where: { brand_id: userId },
        include: [
          {
            model: WishlistItemModel,
            include: [
              {
                model: UserModel,
                attributes: { exclude: ["password"] },
                include: [{ model: InfluencerProfileModel, attributes: ["id", "display_name", "price_start"] }],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: wishlists,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * @description Get a wishlist by ID (brand's own only)
   * @param req
   * @param res
   * @returns Single wishlist with items and influencer details
   */
  const getWishlistById = async (req, res) => {
    try {
      const userId = req.user.id;

      const { id } = req.query;
      const wishlist = await WishlistModel.findOne({
        where: { id, brand_id: userId },
        include: [
          {
            model: WishlistItemModel,
            include: [
              {
                model: UserModel,
                attributes: { exclude: ["password"] },
                include: [{ model: InfluencerProfileModel, attributes: ["id", "display_name", "price_start"] }],
              },
            ],
          },
        ],
      });

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "Wishlist not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getWishlists,
    createWishlist,
    updateWishlist,
    getWishlistById,
  };
};

module.exports = WishlistController;
