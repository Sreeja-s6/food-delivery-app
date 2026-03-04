require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");


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
app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ],
    credentials: true
}));
app.use(express.json());


// test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});