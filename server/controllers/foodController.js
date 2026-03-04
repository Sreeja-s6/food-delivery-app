const Food = require("../models/Food");
const { cloudinary } = require("../config/multer");

// ADD FOOD (Admin)
exports.createFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        const food = new Food({
            name,
            description,
            price: Number(price),
            category,
            image: req.file ? req.file.path : null,        // ✅ Cloudinary URL
            imagePublicId: req.file ? req.file.filename : null, // ✅ for deletion
            createdBy: req.user.userId
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

        // If new image uploaded, delete old from Cloudinary
        if (req.file) {
            if (food.imagePublicId) {
                await cloudinary.uploader.destroy(food.imagePublicId);
            }
            food.image = req.file.path;             // ✅ new Cloudinary URL
            food.imagePublicId = req.file.filename; // ✅ new public id
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
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food)
            return res.status(404).json({ message: "Food not found" });

        // ✅ Delete image from Cloudinary
        if (food.imagePublicId) {
            await cloudinary.uploader.destroy(food.imagePublicId);
        }

        await food.deleteOne();

        res.json({ message: "Food deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};