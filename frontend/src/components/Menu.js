import React, { useEffect, useState, useContext } from "react";
import { Form, Button, ButtonGroup } from "react-bootstrap";
import { CartContext } from "./CartContext";
import Footer from "./Footer";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/Menu.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart, removeFromCart, getQuantity } = useContext(CartContext);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("❌ Error loading menu:", err.message);
      setMenuItems([]);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchMenuItems();
    } else {
      try {
        const res = await fetch(`${API_URL}/api/menu/search?q=${value}`);
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("❌ Search error:", err.message);
        setMenuItems([]);
      }
    }
  };

  return (
    <>
      <main className="product-section">
        <h2 id="meniu">🍽 Our Menu</h2>

        <Form.Control
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="product-grid">
          {menuItems.length === 0 ? (
            <p>🔄 Loading menu or no products found...</p>

          

          ) : (
            menuItems.map((item) => {
              const quantity = getQuantity(item.id);
              const name = item.name || "Name unavailable";
              const description = item.description || "Description unavailable";
              const validImage = item.image_url?.startsWith("http");

              return (
                <div className="product-card" key={item.id}>
                  {validImage ? (
                    <img
                      src={item.image_url}
                      alt={name}
                      className="product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/img/no-image.png`;
                      }}
                    />
                  ) : (
                    <div className="no-img-placeholder">❌ Image unavailable</div>
                  )}

                  <h3>{name}</h3>
                  <p className="product-description">{description}</p>

                  <div className="bottom-card">
                    <p className="price">
                      <strong>{item.price} €</strong>
                    </p>

                    {quantity === 0 ? (
                      <Button
                        variant="primary"
                        className="add-to-cart-btn"
                        onClick={() => {
                          if (item.id && item.price) addToCart(item);
                          else toast.error("⚠️ Product info incomplete");
                        }}
                      >
                        <FaShoppingCart className="cart-btn-icon" style={{ marginRight: "10px" }} />
                        <span>Add to cart</span>
                      </Button>
                    ) : (
                      <>
                        <ButtonGroup className="mb-2">

                          
                          <Button
                            variant="outline-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ➖
                          </Button>
                          <Button variant="outline-secondary" disabled>
                            {quantity}
                          </Button>

=======
                          <Button
                            variant="outline-success"
                            onClick={() => addToCart(item)}
                          >

                            ➕
                          </Button>
                        </ButtonGroup>

                        <Button
                          variant="outline-primary"
                          size="sm"

                          onClick={() => toast.success(`✔️ ${name} (${quantity}) added to cart`)}

                        >
                          Confirm item
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Menu;
