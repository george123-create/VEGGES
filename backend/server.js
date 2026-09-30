require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());

app.use(
    cors({
        origin: true,
        credentials: true
    })
);


// ======================================
// SERVE UPLOADED IMAGES
// ======================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ======================================
// DATABASE CONNECTION
// ======================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    });


// ======================================
// IMPORT ROUTES
// ======================================

const userRoutes = require("./routes/userRoutes");

const productRoutes = require("./routes/productRoutes");

const cartRoutes = require("./routes/cartRoutes");

const orderRoutes = require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const contactRoutes = require("./routes/contactRoutes");

const adminRoutes = require("./routes/adminRoutes");

const categoryRoutes = require("./routes/categoryRoutes");


// ======================================
// API ROUTES
// ======================================

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/categories", categoryRoutes);


// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to VEGGES API 🚀"
    });

});


// ======================================
// 404 ROUTE HANDLER
// ======================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ======================================
// START SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 VEGGES Server running on port ${PORT}`
    );

});