const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");
// const crypto = require("crypto");

// GENERATE OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// SIGNUP
exports.signup = async (req, res) => {
    try {
    //    const { name, email, password, phone } = req.body;

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) 
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            // phone,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000,
            isVerified: false
        });

        await user.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your email",
            text: `Your OTP is ${otp}`
        });

        res.status(201).json({
            message: "Signup successful. OTP sent to email"
        });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error });
    }
};

// VERIFY EMAIL OTP
exports.verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        if (Date.now() > user.otpExpiry)
            return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.json({ message: "Email verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};

// LOGIN STEP 1 (email + password)
// SEND LOGIN OTP

exports.login_2fa = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified)
            return res.status(401).json({ message: "Please verify email first" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const otp = generateOTP();

        user.loginOTP = otp;
        user.loginOTPExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Your login OTP",
            text: `Your login OTP is ${otp}`
        });

        res.json({
            message: "OTP sent to email",
            userId: user._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "login failed" });
    }
};

// VERIFY LOGIN OTP -> JWT
exports.verify_2fa_otp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);

        if (!user)
            return res.status(400).json({ message: "User not found" });

        if (user.loginOTP !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        if (Date.now() > user.loginOTPExpiry)
            return res.status(400).json({ message: "OTP expired" });

        user.loginOTP = null;
        user.loginOTPExpiry = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ message: "OTP verification failed" });
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ messgae: "User not found" });

        const otp = generateOTP();

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Reset password OTP",
            text: `Your OTP is ${otp}`
        });

        res.json({ message: "Reset OTP sent to email" });

    } catch (error) {
        res.status(500).json({ message: "Forgot password failed" });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: "Invalid request" });

        if (user.resetPasswordOTP !== otp)
            return res.status(400).json({message: "Invalid OTP" });

        if (Date.now() > user.resetPasswordExpires)
            return res.status(400).json({ message: "OTP expired" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ messgae: "Password reset successfull" });

    } catch (error) {
        res.status(500).json({ message: "Reset password failed" });
    }
};