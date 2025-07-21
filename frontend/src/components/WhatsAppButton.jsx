import React from "react";
import "../styles/WhatsAppButton.css";

function WhatsAppButton() {
  return (
<a
  href="https://wa.me/31685300906"
  className="whatsapp-button"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
    alt="WhatsApp"
    className="whatsapp-icon"
  />
</a>

  );
}

export default WhatsAppButton;