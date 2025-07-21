import React from "react";
import "../styles/ProductList.css";

function ProductList() {
  return (
    <main className="product-section">
      <h2>Our Menu</h2>
      <div className="product-grid">
        <div className="product-card">
          <img src="/images/sarmale.jpg" alt="Cabbage Rolls" />
          <h3>Cabbage Rolls (Sarmale)</h3>
          <p>29 €</p>
          <button>Add to Cart</button>
        </div>
        {/* Add more cards here */}
      </div>
    </main>
  );
}

export default ProductList;