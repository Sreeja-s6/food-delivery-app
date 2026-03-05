import axiosInstance from "./axiosInstance";

// SIGNUP
export const signup = (data) => axiosInstance.post("/api/auth/signup", data);

// VERIFY EMAIL OTP
export const verifyEmailOtp = (data) => axiosInstance.post("/api/auth/verify-email", data);

// LOGIN STEP 1
export const login = (data) => axiosInstance.post("/api/auth/login", data);

// VERIFY LOGIN OTP
export const verifyLoginOtp = (data) => axiosInstance.post("/api/auth/verify-login-otp", data);

export const forgotPassword = (data) =>
    axiosInstance.post("/api/auth/forgot-password", data);

export const resetPassword = (data) =>
    axiosInstance.post("/api/auth/reset-password", data);