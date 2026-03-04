const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: {
        type: String,
        required: true
        // Now stores Cloudinary URL instead of filename
    },
    imagePublicId: {
        type: String  // ✅ Cloudinary public_id for deletion
    },
    available: { type: Boolean, default: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);