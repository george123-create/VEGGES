const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrders
} = require("../controllers/orderController");

// Place Order
router.post("/place", placeOrder);

// Get User Orders
router.get("/:userId", getOrders);

module.exports = router;