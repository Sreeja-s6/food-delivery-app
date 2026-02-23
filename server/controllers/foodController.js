const Food = require("../models/Food");

// ADD FOOD (Admin)
exports.createFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        const image = req.file ? req.file.path : "";

        const food = new Food({
            name,
            description,
            price: Number(price),
            category,
            image: req.file ? req.file.filename : null,
            createdBy: req.user.userId // admin id from JWT
        });

        await food.save();

        res.status(201).json({
            message: "Food added successfully",
            food
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding food", error });
    }
};

// GET ALL FOOD (public)
exports.getAllFood = async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching foods" });
    }
};

// GET SINGLE FOOD
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food)
            return res.status(404).json({ message: "Food not found" });

        res.json(food);

    } catch (error) {
        res.status(500).json({ message: "Error fetching food" });
    }
};

// UPDATE FOOD (Admin)
exports.updateFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        const food = await Food.findById(req.params.id);

        if (!food)
            return res.status(404).json({ message: "Food not found" });

        if (req.file) {
            // food.image = req.file.path;
            food.image = req.file.filename;
        }

        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price ? Number(price) : food.price;
        food.category = category || food.category;

        await food.save();

        res.json({ message: "Food updated", food });

    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

// DELETE FOOD (Admin)
const fs = require("fs");

exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food)
            return res.status(404).json({ message: "Food not found" });

        // delete image from uploads folder
        if (food.image) {
            fs.unlink(food.image, (err) => {
                if (err)
                    console.log("Image delete error:", err);
            });
        }

        await food.deleteOne();

        res.json({ message: "Food deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};