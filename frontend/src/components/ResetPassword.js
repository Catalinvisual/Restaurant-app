import React, { useState } from "react";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!email || !newPassword || !confirmNewPassword) {
      return setStatus("⚠️ Please complete all fields.");
    }

    if (newPassword !== confirmNewPassword) {
      return setStatus("⚠️ Passwords do not match.");
    }

    try {
      setLoading(true);
      console.log("🔐 Sending password reset for:", { email, newPassword });

      const res = await fetch("https://restaurant-app-backend-kvvn.onrender.com/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Password has been reset successfully!");
        setEmail("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setStatus(`❌ ${data.error || "Password reset failed."}`);
      }
    } catch (err) {
      console.error("❌ Network error:", err.message);
      setStatus("❌ Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-container">
        <h2>🔒 Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            required
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Reset Password"}
          </button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
