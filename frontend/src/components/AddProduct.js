import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://restaurant-app-backend-kvvn.onrender.com";


function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(`${API_URL}/upload`, formData);
      if (res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
      } else {
        alert("Upload succeeded but no image URL received.");
      }
    } catch (err) {
      console.error("❌ Image upload error:", err.message);
      alert("Error uploading image.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !imageUrl) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/menu`, {
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
      });

      alert("✅ Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setImageUrl("");
    } catch (err) {
      console.error("❌ Product save error:", err.message);
      alert("Error saving product.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h3>Add a product 🍽️</h3>

      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginTop: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          fontSize: "1rem",
          fontFamily: "inherit",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginTop: "1rem" }}
      />
      <button onClick={handleImageUpload} style={{ marginTop: "0.5rem" }}>
        Upload image 🖼️
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            width: "100%",
            marginTop: "1rem",
            borderRadius: "8px",
          }}
        />
      )}

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Save product ✅
      </button>
    </div>
  );
}

export default AddProduct;
