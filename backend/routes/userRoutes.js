const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const {
    protect
} = require("../middleware/authMiddleware");


// ==========================
// AUTH ROUTES
// ==========================

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);


// ==========================
// PROFILE ROUTES
// ==========================

router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);


// ==========================
// CHANGE PASSWORD
// ==========================

router.put(
    "/change-password",
    protect,
    changePassword
);


module.exports = router;