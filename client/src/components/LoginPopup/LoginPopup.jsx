import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import {
  signup, verifyEmailOtp, login, verifyLoginOtp,
  forgotPassword, resetPassword,
} from "../../api/authApi";

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const emptyData = { name: "", email: "", password: "", otp: "" };

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState(emptyData);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // ✅ eye toggle

  const switchState = (newState) => {
    setCurrState(newState);
    setData(emptyData);
    setErrors({});
    setShowPassword(false); // ✅ reset eye on state change
  };

  const onChangehandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
    let error = "";
    if (name === "name" && value && !nameRegex.test(value))
      error = "Name must contain only letters and spaces";
    if (name === "email" && value && !emailRegex.test(value))
      error = "Enter a valid email address";
    if (name === "password" && value && !passwordRegex.test(value))
      error = "Min 6 chars: uppercase, lowercase, number & special character";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateSignup = () => {
    const errs = {};
    if (!nameRegex.test(data.name)) errs.name = "Name must contain only letters and spaces";
    if (!emailRegex.test(data.email)) errs.email = "Enter a valid email address";
    if (!passwordRegex.test(data.password)) errs.password = "Min 6 chars: uppercase, lowercase, number & special character";
    return errs;
  };

  const validateLogin = () => {
    const errs = {};
    if (!emailRegex.test(data.email)) errs.email = "Enter a valid email address";
    if (!passwordRegex.test(data.password)) errs.password = "Min 6 chars: uppercase, lowercase, number & special character";
    return errs;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup({ name: data.name, email: data.email, password: data.password });
      setCurrState("VerifyEmailOtp");
      setErrors({});
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Signup failed" });
    }
    setLoading(false);
  };

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmailOtp({ email: data.email, otp: data.otp });
      switchState("Login");
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid OTP" });
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await login({ email: data.email, password: data.password });
      setUserId(res.data.userId);
      setCurrState("VerifyLoginOtp");
      setErrors({});
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Login failed" });
    }
    setLoading(false);
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyLoginOtp({ userId, otp: data.otp });
      localStorage.setItem("token", res.data.token);
      setShowLogin(false);
      window.location.reload();
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid OTP" });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(data.email)) {
      setErrors({ email: "Enter a valid email address" }); return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email: data.email });
      setData((prev) => ({ ...emptyData, email: prev.email }));
      setErrors({});
      setCurrState("ResetPassword");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Failed to send OTP" });
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(data.password)) {
      setErrors({ password: "Min 6 chars: uppercase, lowercase, number & special character" }); return;
    }
    setLoading(true);
    try {
      await resetPassword({ email: data.email, otp: data.otp, newPassword: data.password });
      switchState("Login");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Reset failed" });
    }
    setLoading(false);
  };

  const titles = {
    Login: "Login", "Sign Up": "Sign Up",
    VerifyEmailOtp: "Verify Email", VerifyLoginOtp: "Verify Login",
    ForgotPassword: "Forgot Password", ResetPassword: "Reset Password",
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container">

        <div className="login-popup-title">
          <h2>{titles[currState]}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        {errors.general && (
          <p className="lp-error general-error">{errors.general}</p>
        )}

        <div className="login-popup-inputs">

          {/* NAME */}
          {currState === "Sign Up" && (
            <div className="lp-field">
              <input name="name" onChange={onChangehandler} value={data.name}
                type="text" placeholder="Name" />
              {errors.name && <span className="lp-error">{errors.name}</span>}
            </div>
          )}

          {/* EMAIL */}
          {(currState === "Sign Up" || currState === "Login" ||
            currState === "ForgotPassword" || currState === "ResetPassword") && (
            <div className="lp-field">
              <input name="email" onChange={onChangehandler} value={data.email}
                type="email" placeholder="Email"
                readOnly={currState === "ResetPassword"}
              />
              {errors.email && <span className="lp-error">{errors.email}</span>}
            </div>
          )}

          {/* OTP */}
          {(currState === "VerifyEmailOtp" || currState === "VerifyLoginOtp" ||
            currState === "ResetPassword") && (
            <div className="lp-field">
              <input name="otp" onChange={onChangehandler} value={data.otp}
                type="text" placeholder="Enter OTP" />
              {errors.otp && <span className="lp-error">{errors.otp}</span>}
            </div>
          )}

          {/* PASSWORD WITH EYE ICON */}
          {(currState === "Sign Up" || currState === "Login" ||
            currState === "ResetPassword") && (
            <div className="lp-field">
              <div className="lp-password-wrapper">
                <input
                  name="password"
                  onChange={onChangehandler}
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  placeholder={currState === "ResetPassword" ? "New Password" : "Password"}
                />
                <span
                  className="lp-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
              {errors.password && <span className="lp-error">{errors.password}</span>}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        {currState === "Sign Up" && (
          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Please wait..." : "Create account"}
          </button>
        )}
        {currState === "Login" && (
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        )}
        {currState === "VerifyEmailOtp" && (
          <button onClick={handleVerifyEmailOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}
        {currState === "VerifyLoginOtp" && (
          <button onClick={handleVerifyLoginOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}
        {currState === "ForgotPassword" && (
          <button onClick={handleForgotPassword} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}
        {currState === "ResetPassword" && (
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        )}

        {/* FOOTER LINKS */}
        <div className="lp-links">
          {currState === "Login" && (
            <>
              <p>New here? <span onClick={() => switchState("Sign Up")}>Sign Up</span></p>
              <p>Forgot password? <span onClick={() => switchState("ForgotPassword")}>Click here</span></p>
            </>
          )}
          {currState === "Sign Up" && (
            <p>Already have an account? <span onClick={() => switchState("Login")}>Login</span></p>
          )}
          {(currState === "ForgotPassword" || currState === "ResetPassword" ||
            currState === "VerifyEmailOtp" || currState === "VerifyLoginOtp") && (
            <p>Back to <span onClick={() => switchState("Login")}>Login</span></p>
          )}
        </div>

      </form>
    </div>
  );
}

export default LoginPopup;