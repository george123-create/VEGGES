const express = require("express");

const router = express.Router();

const {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// ======================================
// PUBLIC PRODUCT ROUTES
// ======================================

// Get all products
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);


// ======================================
// ADMIN PRODUCT ROUTES
// ======================================

// Add product
router.post(
    "/add",
    protect,
    adminOnly,
    addProduct
);


// Update product
router.put(
    "/:id",
    protect,
    adminOnly,
    updateProduct
);


// Delete product
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteProduct
);


module.exports = router;