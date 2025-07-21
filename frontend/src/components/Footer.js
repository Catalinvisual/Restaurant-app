import React from "react";
import "../styles/Footer.css";
import FacebookIcon from "../assets/images/facebook.svg";
import InstagramIcon from "../assets/images/instagram.svg";
import TikTokIcon from "../assets/images/tiktok.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* 📍 Google Map */}
        <div className="footer-map">
          <h3>📍 Location</h3>
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38676.642074323856!2d5.716165755756738!3d52.70890836284688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c887eb7e9f0421%3A0xb5be45c8beacb060!2sEmmeloord!5e0!3m2!1sen!2snl!4v1752492202629!5m2!1sen!2snl"
            width="100%"
            height="200"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 🧾 Info */}
        <div className="footer-info">
          <h3>🕒 Opening Hours</h3>
          <p>Monday–Sunday: 10:00–22:00</p>
          <h3>📞 Contact</h3>
          <p><a href="tel:+40740123456">0740 123 456</a></p>
          <h3>📧 Email</h3>
          <p><a href="mailto:rezervari@restaurantandrei.ro">rezervari@restaurantandrei.ro</a></p>
        </div>

        {/* 💬 Contact Form */}
        <div className="footer-form">
          <h3>📩 Write to Us</h3>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="3" placeholder="Message" required></textarea>
            <button type="submit">Send</button>
          </form>
        </div>

        {/* 🌐 Social Media */}
        <div className="footer-social">
          <h3>🔗 Follow Us</h3>
          <div className="social-icons-row">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={FacebookIcon} alt="Facebook" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src={InstagramIcon} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://www.tiktok.com/@restaurantandrei" target="_blank" rel="noreferrer">
              <img src={TikTokIcon} alt="TikTok" className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* 🔒 Legal */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Restaurant Andrei. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
