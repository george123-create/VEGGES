const express = require("express");

const router = express.Router();


// ======================================
// IMPORT CATEGORY CONTROLLER
// ======================================

const {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");


// ======================================
// IMPORT AUTH MIDDLEWARE
// ======================================

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// ======================================
// PUBLIC - GET ALL CATEGORIES
// ======================================

router.get(
    "/",
    getCategories
);


// ======================================
// ADMIN - ADD CATEGORY
// ======================================

router.post(
    "/",
    protect,
    adminOnly,
    addCategory
);


// ======================================
// ADMIN - UPDATE CATEGORY
// ======================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateCategory
);


// ======================================
// ADMIN - DELETE CATEGORY
// ======================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteCategory
);


module.exports = router;