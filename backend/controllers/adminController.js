const Product = require("../models/Product");
const User = require("../models/Users");
const Order = require("../models/Order");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================================
// ADMIN LOGIN
// ======================================

const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }


        // =========================
        // FIND ADMIN
        // =========================

        const admin = await User.findOne({
            email: email.toLowerCase()
        });


        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // =========================
        // CHECK ADMIN ROLE
        // =========================

        if (admin.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });

        }


        // =========================
        // CHECK PASSWORD
        // =========================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // =========================
        // CREATE JWT TOKEN
        // =========================

        const token = jwt.sign(

            {
                id: admin._id,
                role: admin.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.status(200).json({

            success: true,

            message: "Admin login successful.",

            token,

            user: {

                _id: admin._id,

                name: admin.name,

                email: admin.email,

                role: admin.role

            }

        });

    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Admin login failed."

        });

    }

};



// ======================================
// GET ADMIN DASHBOARD STATISTICS
// ======================================

const getDashboardStats = async (req, res) => {

    try {

        // =========================
        // TOTAL PRODUCTS
        // =========================

        const totalProducts =
            await Product.countDocuments();


        // =========================
        // TOTAL CUSTOMERS
        // =========================

        const totalCustomers =
            await User.countDocuments({
                role: "customer"
            });


        // =========================
        // TOTAL ORDERS
        // =========================

        const totalOrders =
            await Order.countDocuments();


        // =========================
        // TOTAL REVENUE
        // =========================

        const revenueData =
            await Order.aggregate([

                {
                    $match: {
                        paymentStatus: "Paid"
                    }
                },

                {
                    $group: {

                        _id: null,

                        totalRevenue: {
                            $sum: "$totalAmount"
                        }

                    }
                }

            ]);


        const totalRevenue =
            revenueData.length > 0
                ? revenueData[0].totalRevenue
                : 0;


        // =========================
        // RECENT ORDERS
        // =========================

        const recentOrders =
            await Order.find()

                .sort({
                    createdAt: -1
                })

                .limit(5)

                .populate(
                    "user",
                    "name email"
                );


        // =========================
        // SEND RESPONSE
        // =========================

        res.status(200).json({

            success: true,

            stats: {

                totalProducts,

                totalCustomers,

                totalOrders,

                totalRevenue

            },

            recentOrders

        });

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard statistics."

        });

    }

};
// ======================================
// GET ALL ORDERS - ADMIN
// ======================================

const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate(
                "user",
                "name email phone"
            )

            .populate(
                "products.product",
                "name price image category"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count: orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get all orders error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to load orders."

        });

    }

};
// ======================================
// UPDATE ORDER STATUS - ADMIN
// ======================================

const updateOrderStatus = async (req, res) => {

    try {

        const { orderStatus } = req.body;


        // =========================
        // VALID ORDER STATUSES
        // =========================

        const validStatuses = [

            "Pending",
            "Confirmed",
            "Packed",
            "Shipped",
            "Delivered",
            "Cancelled"

        ];


        if (!validStatuses.includes(orderStatus)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status."

            });

        }


        // =========================
        // FIND ORDER
        // =========================

        const order = await Order.findById(
            req.params.id
        );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }


        // =========================
        // UPDATE STATUS
        // =========================

        order.orderStatus = orderStatus;

        await order.save();


        res.status(200).json({

            success: true,

            message: "Order status updated successfully.",

            order

        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to update order status."

        });

    }

};
// ======================================
// GET ALL CUSTOMERS - ADMIN
// ======================================

const getAllCustomers = async (req, res) => {

    try {

        const customers = await User.find({
            role: "customer"
        })

            .select("-password")

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count: customers.length,

            customers

        });

    } catch (error) {

        console.error(
            "Get all customers error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to load customers."

        });

    }

};


// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports = {

    adminLogin,

    getDashboardStats,

    getAllOrders,

    updateOrderStatus,

    getAllCustomers

};