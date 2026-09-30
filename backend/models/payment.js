const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    // Razorpay Order ID
    razorpayOrderId: {
        type: String,
        default: ""
    },

    // Razorpay Payment ID
    razorpayPaymentId: {
        type: String,
        default: ""
    },

    // Razorpay Signature
    razorpaySignature: {
        type: String,
        default: ""
    },

    // Transaction ID
    transactionId: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);