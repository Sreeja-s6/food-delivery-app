require('dotenv').config();

// Load environment variables
const express = require("express");
// const dotenv = require("dotenv");
// Initialize env
// dotenv.config();
const cors = require("cors");

// DB connection
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes")
const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");



// Connect database
connectDB();

// Create express app
const app = express();

// GLOBAL MIDDLEWARE
// app.use(cors());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


//server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});