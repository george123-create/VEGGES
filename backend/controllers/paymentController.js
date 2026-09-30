const Payment = require("../models/Payment");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

// ======================================
// CREATE PAYMENT RECORD
// ======================================

exports.createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const payment = new Payment({
            order: orderId,
            amount: order.totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus:
                paymentMethod === "COD"
                    ? "Pending"
                    : "Paid",
            transactionId:
                paymentMethod === "ONLINE"
                    ? "TXN" + Date.now()
                    : ""
        });

        await payment.save();

        order.paymentMethod = paymentMethod;
        order.paymentStatus =
            payment.paymentStatus;

        await order.save();

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        });

    } catch (error) {
        console.error("Create Payment Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// GET ALL PAYMENTS
// ======================================

exports.getAllPayments = async (req, res) => {
    try {

        const payments =
            await Payment.find().populate("order");

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ======================================
// GET PAYMENT BY ID
// ======================================

exports.getPaymentById = async (req, res) => {
    try {

        const payment =
            await Payment.findById(req.params.id)
                .populate("order");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ======================================
// UPDATE PAYMENT STATUS
// ======================================

exports.updatePaymentStatus = async (req, res) => {
    try {

        const {
            paymentStatus,
            transactionId
        } = req.body;

        const payment =
            await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (paymentStatus) {
            payment.paymentStatus =
                paymentStatus;
        }

        if (transactionId) {
            payment.transactionId =
                transactionId;
        }

        await payment.save();

        await Order.findByIdAndUpdate(
            payment.order,
            {
                paymentStatus:
                    payment.paymentStatus
            }
        );

        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ======================================
// CREATE RAZORPAY ORDER
// ======================================

exports.createRazorpayOrder = async (req, res) => {

    try {

        const { orderId } = req.body;

        const order =
            await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const options = {

            amount:
                Math.round(order.totalAmount * 100),

            currency: "INR",

            receipt:
                `receipt_${order._id}`

        };

        const razorpayOrder =
            await razorpay.orders.create(options);

        res.status(200).json({

            success: true,

            razorpayOrder

        });

    } catch (error) {

        console.error(
            "Razorpay Order Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================
// VERIFY RAZORPAY PAYMENT
// ======================================

exports.verifyRazorpayPayment = async (req, res) => {

    try {

        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        // Check required data

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification data is missing"

            });

        }


        // ==================================
        // CREATE SIGNATURE
        // ==================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        // ==================================
        // COMPARE SIGNATURE
        // ==================================

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid Razorpay payment signature"

            });

        }


        // ==================================
        // FIND VEGGES ORDER
        // ==================================

        const order =
            await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        // ==================================
        // UPDATE ORDER
        // ==================================

        order.paymentMethod = "ONLINE";

        order.paymentStatus = "Paid";

        order.orderStatus = "Confirmed";

        await order.save();


        // ==================================
        // CREATE PAYMENT RECORD
        // ==================================

        const payment =
            new Payment({

                order: order._id,

                amount: order.totalAmount,

                paymentMethod: "ONLINE",

                paymentStatus: "Paid",

                transactionId:
                    razorpay_payment_id

            });


        await payment.save();


        // ==================================
        // SUCCESS RESPONSE
        // ==================================

        res.status(200).json({

            success: true,

            message:
                "Payment verified successfully",

            payment

        });

    } catch (error) {

        console.error(
            "Razorpay Verification Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};