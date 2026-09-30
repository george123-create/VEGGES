const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add Product to Cart
exports.addToCart = async (req, res) => {
    try {

        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: []
            });
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId
        );

        if (productIndex > -1) {

            cart.products[productIndex].quantity += quantity;

        } else {

            cart.products.push({
                product: productId,
                quantity
            });

        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Cart
exports.getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.params.userId
        }).populate("products.product");

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });

        }

        res.json({
            success: true,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
    try {

        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const product = cart.products.find(
            item => item.product.toString() === productId
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        product.quantity = quantity;

        await cart.save();

        res.json({
            success: true,
            message: "Quantity updated",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Remove Product From Cart
exports.removeFromCart = async (req, res) => {

    try {

        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Clear Cart
exports.clearCart = async (req, res) => {

    try {

        const { userId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.products = [];

        await cart.save();

        res.json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};