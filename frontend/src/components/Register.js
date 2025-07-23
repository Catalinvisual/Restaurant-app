import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

// 🔗 Backend public pe Render

const API_URL = process.env.REACT_APP_API_URL;


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "⚠️ Registration error.");
        return;
      }

      setSuccessMessage(data.message || "✅ Account successfully created!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("❌ Connection failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <form className="register-box" onSubmit={handleRegister}>
        <h2>📝 Register</h2>

        {error && (
          <p className="error-message">
            ⚠️ {error} <a href="/reset">Reset password</a>
          </p>
        )}

        {successMessage && (
          <p className="success-message">
            ✅ {successMessage} <br />
            🔐 Logging in → <span style={{ color: "#f27" }}>redirecting...</span>
          </p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
