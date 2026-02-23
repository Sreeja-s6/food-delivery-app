const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        // required: true
    },

    // Email verification OTP (signup)
    otp: String,
    otpExpiry: Date,
    isVerified: {
        type: Boolean,
        default: false
    },

    // LOGIN 2FA OTP
    loginOTP: String,
    loginOTPExpiry: Date,

    // Forgot password
    resetPasswordOTP: String,
    resetPasswordExpires: Date,

    // // Login OTP
    // loginOTP: String,
    // loginOTPExpiry: Date,

    // Role (Admin or User)
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // User Address for food delivery
    address: [
        {
            street: String,
            city: String,
            state: String,
            pincode: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)