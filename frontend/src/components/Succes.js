import React from "react";
import { Container, Alert } from "react-bootstrap";

function Success() {
  return (
    <Container className="mt-4">
      <Alert variant="success">
        ✅ Your order has been successfully processed!
      </Alert>
      <p>Thank you for choosing us — we look forward to serving you again!</p>
    </Container>
  );
}

export default Success;