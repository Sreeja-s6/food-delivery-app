const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
        // Example: Salad, Rolls, Deserts, Sandwich, Cake, Pasta, Noodles
    },

    image: {
        type: String,
        required: true
        // Stored image path from multer
    },

    available: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        // Admin ID
    }
}, { timestamps: true});

module.exports = mongoose.model("Food", foodSchema);