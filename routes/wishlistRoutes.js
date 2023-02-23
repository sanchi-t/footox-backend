const express = require("express");
const wishlistController = require('../controllers/wishlistController');
const router = express.Router();


router.post(
    "/Wishlist",
    wishlistController.viewWishlist,
  )
  
router.get("/getWishlist",wishlistController.getWishlist);

router.post("/deleteWishlist", wishlistController.delWishlist);

module.exports = router;