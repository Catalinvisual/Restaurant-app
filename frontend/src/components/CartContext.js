import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // 🔄 Initial fetch from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // 🔁 Reusable fetch function
  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("❌ Error loading menu:", err);
    }
  };

  // ✅ Public function exposed to other components to refresh menu items
  const refreshMenuItems = () => {
    fetchMenuItems();
  };

  // ➕ Add product to cart
  const addToCart = (item) => {
    const exist = cartItems.find((i) => i.id === item.id);
    if (exist) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // ➖ Remove or decrement product from cart
  const removeFromCart = (id) => {
    const exist = cartItems.find((i) => i.id === id);
    if (exist?.quantity > 1) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // 🔢 Get quantity for a specific product
  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        menuItems,
        addToCart,
        removeFromCart,
        getQuantity,
        refreshMenuItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}