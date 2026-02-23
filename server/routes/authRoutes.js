const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// SIGNUP
router.post("/signup", authController.signup);

// VERIFY EMAIL OTP
router.post("/verify-email", authController.verifyEmailOTP);


// LOGIN STEP 1 (email + password)
// sends Login OTP
router.post("/login", authController.login_2fa);


// VERIFY LOGIN OTP (2FA)
router.post("/verify-login-otp", authController.verify_2fa_otp);

// FORGOT PASSWORD
router.post("/forgot-password", authController.forgotPassword);

// RESET PASSWORD
router.post("/reset-password", authController.resetPassword);

module.exports = router;