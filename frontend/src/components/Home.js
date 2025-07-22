import React from "react";
import "../styles/Home.css";
import Footer from "./Footer";
import videoSrc from "../assets/images/video-homepage.mp4";
import Dish1 from "../assets/images/dish1.jpg";
import Dish2 from "../assets/images/dish2.jpg";
import Dish3 from "../assets/images/dish3.jpg";
import Dish4 from "../assets/images/dish4.jpg";
import ChefFoto from "../assets/images/chef.jpg";

function Home() {
  return (
    <div className="home-page">
      {/* 🎥 Hero video */}
      <div className="hero-container">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* 🔳 Text & button overlay */}
        <div className="video-overlay">
          <h1>Welcome to Restaurant Andrei</h1>
          <p>Authentic culinary experiences in the heart of the city</p>
          <a href="/menu" className="menu-btn">
            🍽️ View Menu
          </a>
        </div>
      </div>

      {/* 🧑‍🍳 About */}
      <div className="about-section">
        <h2>About Us</h2>
        <p>
          Restaurant Andrei offers traditional and international dishes in an elegant and friendly atmosphere.
        </p>
      </div>

      {/* 🛎️ Services */}
      <div className="services-section">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <span>🚚</span>
            <h3>Fast Delivery</h3>
            <p>Order our dishes from the comfort of your home.</p>
          </div>
          <div className="service-card">
            <span>🎉</span>
            <h3>Private Events</h3>
            <p>We host festive dinners, weddings, and corporate parties.</p>
          </div>
          <div className="service-card">
            <span>🍷</span>
            <h3>Gourmet Cuisine</h3>
            <p>Discover our refined menu crafted by experienced chefs.</p>
          </div>
        </div>
      </div>

      {/* 🍽️ Gallery */}
      <div className="gallery-section">
        <h2>Culinary Gallery</h2>
        <div className="gallery-grid">
          <img src={Dish1} alt="Dish 1" />
          <img src={Dish2} alt="Dish 2" />
          <img src={Dish3} alt="Dish 3" />
          <img src={Dish4} alt="Dish 4" />
        </div>
      </div>

      {/* 👨‍🍳 Chef section */}
      <div className="chef-section">
        <img src={ChefFoto} alt="Chef" />
        <div className="chef-content">
          <h2>Chef Andrei</h2>
          <p>
            With over 20 years of experience, Chef Andrei turns every dish into a memorable story.
          </p>
          <blockquote>“Every flavor is an emotion. Every plate tells a story.”</blockquote>
        </div>
      </div>

      {/* 💬 Testimonials */}
      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>Impeccable service and delicious food! Highly recommended!</p>
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <h4>— Ioana M.</h4>
          </div>
          <div className="testimonial-card">
            <p>The atmosphere is wonderful, and the dishes are top-notch!</p>
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <h4>— Vlad T.</h4>
          </div>
        </div>
      </div>

      {/* 📅 Reservation form */}
      <div className="reservation-section">
        <h2>Book a Table</h2>
        <form className="reservation-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="date" required />
          <input
            type="number"
            placeholder="Number of guests"
            min="1"
            max="20"
            required
          />
          <button type="submit">Send Reservation</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
