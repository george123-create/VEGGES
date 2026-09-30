const express = require("express");

const router = express.Router();


// ======================================
// ADMIN CONTROLLER
// ======================================

const {

    adminLogin,

    getDashboardStats,

    getAllOrders,

    updateOrderStatus,

    getAllCustomers

} = require("../controllers/adminController");


// ======================================
// CATEGORY CONTROLLER
// ======================================

const {

    getCategories,

    addCategory,

    updateCategory,

    deleteCategory

} = require("../controllers/categoryController");


// ======================================
// AUTH MIDDLEWARE
// ======================================

const {

    protect,

    adminOnly

} = require("../middleware/authMiddleware");


// ======================================
// CATEGORY IMAGE UPLOAD
// ======================================

const categoryUpload = require("../middleware/categoryUpload");


// ======================================
// ADMIN LOGIN
// ======================================

router.post(

    "/login",

    adminLogin

);


// ======================================
// ADMIN DASHBOARD
// ======================================

router.get(

    "/dashboard",

    protect,

    adminOnly,

    getDashboardStats

);


// ======================================
// CATEGORY MANAGEMENT
// ======================================


// GET ALL CATEGORIES

router.get(

    "/categories",

    protect,

    adminOnly,

    getCategories

);


// ADD CATEGORY

router.post(

    "/categories",

    protect,

    adminOnly,

    categoryUpload.single("image"),

    addCategory

);


// UPDATE CATEGORY

router.put(

    "/categories/:id",

    protect,

    adminOnly,

    categoryUpload.single("image"),

    updateCategory

);


// DELETE CATEGORY

router.delete(

    "/categories/:id",

    protect,

    adminOnly,

    deleteCategory

);


// ======================================
// GET ALL ORDERS - ADMIN
// ======================================

router.get(

    "/orders",

    protect,

    adminOnly,

    getAllOrders

);


// ======================================
// UPDATE ORDER STATUS - ADMIN
// ======================================

router.put(

    "/orders/:id/status",

    protect,

    adminOnly,

    updateOrderStatus

);


// ======================================
// GET ALL CUSTOMERS - ADMIN
// ======================================

router.get(

    "/customers",

    protect,

    adminOnly,

    getAllCustomers

);


module.exports = router;