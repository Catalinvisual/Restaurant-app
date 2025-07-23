import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { FaShoppingCart } from "react-icons/fa";
import "../styles/Cart.css";


const API_URL = process.env.REACT_APP_API_URL;


function Cart() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0 || total <= 0) {
      alert("🛑 Your cart is empty or total is invalid.");
      return;
    }

    try {
      const email = "test@mailtrap.io"; // 👉 Poți înlocui cu email real dacă ai formular

      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, total, email }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Server error:", errText);
        alert("Checkout was rejected.");
        return;
      }

      const data = await res.json();
      console.log("✅ Checkout successful:", data);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("❌ Missing payment link.");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error.message);
      alert("Error while processing the order.");
    }
  };

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="cart-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/img/no-image.png`;
                    }}
                  />
                )}

                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>
                    {item.quantity} × {item.price} €
                  </p>
                  <small>
                    Item total: {(item.price * item.quantity).toFixed(2)} €
                  </small>
                </div>

                <div className="item-buttons">
                  <button onClick={() => removeFromCart(item.id)}>➖</button>
                  <button onClick={() => addToCart(item)}>➕</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <h4>💰 Total: {total.toFixed(2)} €</h4>
            <button className="checkout-btn" onClick={handleCheckout}>
              <FaShoppingCart className="cart-icon" />
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
