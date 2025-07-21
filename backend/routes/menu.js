const express = require("express");
const router = express.Router();
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

//
// ✅ MENU ROUTES (simplified)
//

// 📥 Add item
router.post("/menu", async (req, res) => {
  const { name, description, price, image_url } = req.body;

  if (!name || !description || !price || !image_url) {
    return res.status(400).json({ error: "⚠️ All fields are required." });
  }

  try {
    await pool.query(
      `INSERT INTO menu_items (name, description, price, image_url)
       VALUES ($1, $2, $3, $4)`,
      [name, description, price, image_url]
    );

    res.status(201).json({ message: "✅ Item successfully added!" });
  } catch (err) {
    console.error("❌ Error adding item:", err.message);
    res.status(500).json({ error: "Server error while adding item." });
  }
});

// 📋 List menu
router.get("/menu", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, price, image_url
      FROM menu_items
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching menu:", err.message);
    res.status(500).json({ error: "Server error while fetching menu." });
  }
});

// 🔍 Get item by ID
router.get("/menu/item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT id, name, description, price, image_url
      FROM menu_items
      WHERE id = $1
      LIMIT 1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching item:", err.message);
    res.status(500).json({ error: "Server error while fetching item." });
  }
});

// ✏️ Update item
router.put("/menu/:id", async (req, res) => {
  const { name, description, price, image_url } = req.body;
  const { id } = req.params;

  if (!name || !description || !price || !image_url) {
    return res.status(400).json({ error: "⚠️ All fields are required." });
  }

  try {
    await pool.query(
      `UPDATE menu_items SET
        name = $1,
        description = $2,
        price = $3,
        image_url = $4
       WHERE id = $5`,
      [name, description, price, image_url, id]
    );

    res.json({ message: "✅ Item successfully updated!" });
  } catch (err) {
    console.error("❌ Error updating item:", err.message);
    res.status(500).send("Server error while updating item.");
  }
});

// 🗑️ Delete item
router.delete("/menu/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM menu_items WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Error deleting item:", err.message);
    res.status(500).json({ error: "Server error while deleting item." });
  }
});

module.exports = router;