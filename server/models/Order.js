const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    subtotal: {
        type: Number,
        required: true
    },

    deliveryFee: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    isPaid: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "out for delivery", "delivered", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);