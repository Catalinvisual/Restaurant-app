require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USERNAME,
  to: "test@gmail.com",
  subject: "Test nodemailer",
  text: "Confirmare test!",
})
.then(() => console.log("✅ Email trimis cu succes"))
.catch(err => console.error("❌ Eroare:", err.message));