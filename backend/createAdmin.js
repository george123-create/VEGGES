require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");

// ======================================
// CREATE VEGGES ADMIN
// ======================================

const createAdmin = async () => {
    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");


        // Admin details
        const name = "VEGGES Admin";
        const email = "admin@vegges.com";
        const password = "Admin@12345";


        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {

            console.log("⚠️ Admin account already exists");

            await mongoose.connection.close();

            return;
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create admin
        const admin = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: "admin"
        });


        console.log("=================================");
        console.log("✅ ADMIN CREATED SUCCESSFULLY");
        console.log("=================================");
        console.log("Email:", admin.email);
        console.log("Password:", password);
        console.log("Role:", admin.role);
        console.log("=================================");


        // Close MongoDB connection
        await mongoose.connection.close();

    } catch (error) {

        console.error("❌ Failed to create admin");
        console.error(error);

        process.exit(1);
    }
};


// Run function
createAdmin();