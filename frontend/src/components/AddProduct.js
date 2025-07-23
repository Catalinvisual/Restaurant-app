import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("⚠️ Selectează o imagine înainte de upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(`${API_URL}/upload`, formData);
      if (res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
      } else {
        alert("🖼️ Upload reușit dar URL-ul imaginii lipsește.");
      }
    } catch (err) {
      console.error("❌ Eroare upload:", err.message);
      alert("Eroare la încărcarea imaginii.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !imageUrl) {
      alert("⚠️ Completează toate câmpurile.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/menu`, {
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
      });

      alert("✅ Produs adăugat cu succes!");
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setImageUrl("");
    } catch (err) {
      console.error("❌ Eroare salvare produs:", err.message);
      alert("Eroare la salvarea produsului.");
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "2rem auto", padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Adaugă un produs 🍽️</h3>

      <input
        type="text"
        placeholder="Nume produs"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Preț (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Descriere"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ margin: "1rem 0" }}
      />
      <button onClick={handleImageUpload} style={buttonStyle}>
        📤 Încarcă imaginea
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            width: "100%",
            marginTop: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      )}

      <button onClick={handleSubmit} style={{ ...buttonStyle, marginTop: "1rem" }}>
        💾 Salvează produsul
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  fontFamily: "inherit",
};

const buttonStyle = {
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "#3f51b5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
};

export default AddProduct;
