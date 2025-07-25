// 🔐 Load .env first
require("dotenv").config();

// 📦 Core packages
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

// 🐘 PostgreSQL pool
const pool = require("./config/db");

// ☁️ Cloudinary
const cloudinaryStorage = require("./utils/cloudinaryStorage");

// 🛠️ Init app — Render injectează PORT automat
const PORT = process.env.PORT || 10000;
const app = express();

app.use(cors());
app.use(express.json());

// ☁️ Image upload route
const upload = multer({ storage: cloudinaryStorage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file?.secure_url) {
    return res.status(400).json({ error: "Missing or invalid image file." });
  }
  res.json({ imageUrl: req.file.secure_url });
});

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function sendOrderConfirmationEmail(toEmail, items, total) {
  const itemList = items.map(i => `• ${i.name} - ${i.price} €`).join("\n");
  const message = `Hello!\n\n✅ Your order has been successfully registered.\n\n📦 Ordered items:\n${itemList}\n\n💰 Total: ${total.toFixed(2)} €\n📅 Date: ${new Date().toLocaleString()}\n\nThank you for your order!`;

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: "Order Confirmation",
    text: message,
  });
}

// 💳 Stripe setup
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/checkout", async (req, res) => {
  const { items, total, email } = req.body;

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: "ron",
        product_data: {
          name: item.name,
          images: item.image_url?.startsWith("http") ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://restaurant-frontend.vercel.app/success",
      cancel_url: "https://restaurant-frontend.vercel.app/cart",
    });

    res.json({ paymentUrl: session.url });
    await sendOrderConfirmationEmail(email, items, total);
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).send("Payment processing failed.");
  }
});

// 🔐 Modular routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/menu"));

// 🌐 Simple checks
app.get("/", (_, res) => res.send("✅ Express backend is running"));
app.get("/ping", (_, res) => res.send("🔄 Server awake"));

// 🐘 DB Debug route
app.get("/debug-db", async (_, res) => {
  try {
    const result = await pool.query("SELECT version()");
    res.json({ dbVersion: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start backend server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});