const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place Order
exports.placeOrder = async (req, res) => {

    try {

        const {
            userId,
            deliveryAddress,
            paymentMethod
        } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let total = 0;

        cart.products.forEach(item => {
            total += item.product.price * item.quantity;
        });

        const order = new Order({

            user: userId,

            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),

            totalAmount: total,
            deliveryAddress,
            paymentMethod

        });

        await order.save();

        // Clear cart after order
        cart.products = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Orders of a User
exports.getOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.params.userId
        }).populate("products.product");

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};