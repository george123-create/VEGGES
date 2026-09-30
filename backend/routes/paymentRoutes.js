const express = require("express");

const router = express.Router();

const {

    createPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    createRazorpayOrder,
    verifyRazorpayPayment

} = require("../controllers/paymentController");


// ======================================
// PAYMENT APIs
// ======================================

router.post(
    "/create",
    createPayment
);


router.get(
    "/",
    getAllPayments
);


router.get(
    "/:id",
    getPaymentById
);


router.put(
    "/:id",
    updatePaymentStatus
);


// ======================================
// RAZORPAY APIs
// ======================================

router.post(
    "/razorpay/order",
    createRazorpayOrder
);


router.post(
    "/razorpay/verify",
    verifyRazorpayPayment
);


module.exports = router;