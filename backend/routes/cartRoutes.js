const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

// Add product to cart
router.post("/add", addToCart);

// Get cart by user ID
router.get("/:userId", getCart);

// Update quantity
router.put("/update", updateCartQuantity);

// Remove product
router.delete("/remove", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;