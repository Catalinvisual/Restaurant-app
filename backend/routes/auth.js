const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

// 📦 Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🔒 JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.userId = decoded.userId;
    next();
  });
};

// 👤 User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "⚠️ All fields are required.",
    });
  }

  try {
    const existing = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "⚠️ This email is already registered. You can use 'Reset Password'.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "✅ Account successfully created!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error during registration.",
    });
  }
});

// 🔑 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Email not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

// 🔄 Password Reset (Endpoint: /api/reset-password)
router.put("/reset-password", async (req, res) => {
  console.log("🔁 Attempting password reset");

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      error: "Email and new password are required.",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User does not exist." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email.trim().toLowerCase()]
    );

    console.log("✅ Password reset successful for:", email);
    res.json({ message: "Password successfully reset!" });
  } catch (err) {
    console.error("❌ Password reset error:", err.message);
    res.status(500).json({ error: "Server error during password reset." });
  }
});

// 🧾 User Orders (protected by JWT)
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Order listing error:", err.message);
    res.status(500).json({ error: "Server error while listing orders" });
  }
});

// 🍽️ Add menu item
router.post("/menu", async (req, res) => {
  const { name, description, price, image_url } = req.body;

  if (!name || !description || !price || !image_url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await pool.query(
      `INSERT INTO menu_items (name, description, price, image_url)
       VALUES ($1, $2, $3, $4)`,
      [name, description, price, image_url]
    );

    res.status(201).json({ message: "✅ Menu item added!" });
  } catch (err) {
    console.error("❌ Menu save error:", err.message);
    res.status(500).json({ error: "Server error while adding menu item" });
  }
});

module.exports = router;