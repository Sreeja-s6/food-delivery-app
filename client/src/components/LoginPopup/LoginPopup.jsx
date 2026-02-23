import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";

import {
  signup,
  verifyEmailOtp,
  login,
  verifyLoginOtp,
} from "../../api/authApi";

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChangehandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // directly open OTP screen
      setCurrState("VerifyEmailOtp");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // VERIFY EMAIL OTP
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmailOtp({
        email: data.email,
        otp: data.otp,
      });

      // directly move to login
      setCurrState("Login");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // LOGIN STEP 1
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      setUserId(res.data.userId);

      // directly show OTP screen
      setCurrState("VerifyLoginOtp");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // VERIFY LOGIN OTP
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyLoginOtp({
        userId,
        otp: data.otp,
      });

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // close popup
      setShowLogin(false);

      // refresh page so navbar updates
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangehandler}
              value={data.name}
              type="text"
              placeholder="Name"
              required
            />
          )}

          {(currState === "Sign Up" || currState === "Login") && (
            <>
              <input
                name="email"
                onChange={onChangehandler}
                value={data.email}
                type="email"
                placeholder="Email"
                required
              />
              <input
                name="password"
                onChange={onChangehandler}
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {currState === "VerifyEmailOtp" && (
            <input
              name="otp"
              onChange={onChangehandler}
              value={data.otp}
              type="text"
              placeholder="Enter Email OTP"
              required
            />
          )}

          {currState === "VerifyLoginOtp" && (
            <input
              name="otp"
              onChange={onChangehandler}
              value={data.otp}
              type="text"
              placeholder="Enter Login OTP"
              required
            />
          )}
        </div>

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
            {loading ? "Verifying..." : "Verify Email OTP"}
          </button>
        )}

        {currState === "VerifyLoginOtp" && (
          <button onClick={handleVerifyLoginOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify Login OTP"}
          </button>
        )}

        {currState === "Login" && (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        )}

        {currState === "Sign Up" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
