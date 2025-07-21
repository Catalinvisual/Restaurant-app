import React, { useEffect, useState, useContext } from "react";
import "../styles/AdminPanel.css";
import { CartContext } from "./CartContext";

function AdminPanel() {
  const [menuItems, setMenuItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [newPreview, setNewPreview] = useState("");
  const token = localStorage.getItem("token");

  const { refreshMenuItems } = useContext(CartContext);

  useEffect(() => {
    fetch("https://restaurant-app-backend-kvvn.onrender.com/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  const uploadImage = async (file) => {
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("https://restaurant-app-backend-kvvn.onrender.com/upload", {
        method: "POST",
        body: form,
      });
      const text = await res.text();
      const data = JSON.parse(text);
      return data.imageUrl;
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://restaurant-app-backend-kvvn.onrender.com/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMenuItems(menuItems.filter((item) => item.id !== id));
        refreshMenuItems();
      } else {
        console.error("❌ Delete error:", res.status);
      }
    } catch (err) {
      console.error("❌ Network error:", err.message);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData(item);
    setEditFile(null);
    setEditPreview("");
  };

  const handleChangeEdit = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image_url;
    if (editFile) imageUrl = await uploadImage(editFile);

    await fetch(`https://restaurant-app-backend-kvvn.onrender.com/menu/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, image_url: imageUrl }),
    });

    setEditItem(null);
    setEditFile(null);
    setEditPreview("");
    refreshMenuItems();
    window.location.reload();
  };

  const handleChangeNew = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.description) {
      alert("Please complete all fields.");
      return;
    }

    let imageUrl = newItem.image_url;
    if (newFile) {
      imageUrl = await uploadImage(newFile);
    } else {
      alert("Please upload an image.");
      return;
    }

    await fetch("https://restaurant-app-backend-kvvn.onrender.com/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...newItem, image_url: imageUrl }),
    });

    setNewItem({ name: "", price: "", description: "", image_url: "" });
    setNewFile(null);
    setNewPreview("");
    refreshMenuItems();
    window.location.reload();
  };

  return (
    <div className="admin-panel">
      <h2>🧑‍🍳 Admin Panel</h2>

      <div className="admin-card">
        <h3>➕ Add Product</h3>
        <form onSubmit={handleSaveNew}>
          <input
            name="name"
            placeholder="Product name"
            value={newItem.name}
            onChange={handleChangeNew}
            required
          />
          <input
            name="price"
            placeholder="Price"
            value={newItem.price}
            onChange={handleChangeNew}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newItem.description}
            onChange={handleChangeNew}
            required
          />

          <input
            type="file"
            accept="image/*"
            id="upload-new-image"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              setNewFile(file);
              setNewPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
          <div className="button-row">
            <label htmlFor="upload-new-image" className="form-button upload">
              📁 Upload image
            </label>
            <button type="submit" className="form-button save">
              💾 Save product
            </button>
          </div>

          {newPreview && <img src={newPreview} alt="preview" width="120" />}
        </form>
      </div>

      <div className="admin-list">
        <h3>📋 Existing Products</h3>
        <div className="admin-grid">
          {menuItems.map((item) => (
            <div className="product-admin-card" key={item.id}>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="product-img"
                />
              )}
              <h4>{item.name}</h4>
              <p className="price">{item.price} €</p>
              <p className="desc">{item.description}</p>
              <div className="action-buttons">
                <button onClick={() => handleEdit(item)}>✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editItem && (
        <div className="admin-card editing fade-in">
          <h3>✏️ Edit Selected Product</h3>
          <hr className="divider" />
          <form onSubmit={handleSaveEdit}>
            <input
              name="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChangeEdit}
              required
            />
            <input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChangeEdit}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChangeEdit}
              required
            />

            <input
              type="file"
              accept="image/*"
              id="upload-edit-image"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                setEditFile(file);
                setEditPreview(file ? URL.createObjectURL(file) : "");
              }}
            />
            {editPreview && (
              <img
                src={editPreview}
                alt="preview"
                className="image-preview"
                width="120"
              />
            )}

            <div className="button-row">
              <label htmlFor="upload-edit-image" className="form-button upload">
                📁 Replace image
              </label>
              <button type="submit" className="form-button save">
                💾 Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="form-button cancel"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
