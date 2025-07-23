import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 🔗 Backend public pe Render
const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        toast.error("⚠️ Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      console.error("❌ Login error:", error.message);
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>🔐 Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="forgot-password">
          Forgot your password?{" "}
          <span
            onClick={() => navigate("/reset")}
            style={{ cursor: "pointer", color: "#ffa64d" }}
          >
            Reset
          </span>
        </p>

        <button type="submit">Log in</button>

        <button
          type="button"
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Login;