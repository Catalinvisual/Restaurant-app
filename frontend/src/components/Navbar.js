import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import UserIcon from "../assets/images/user.svg";

function AppNavbar() {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  return (
    <Navbar
      expanded={expanded}
      onToggle={setExpanded}
      expand="lg"
      className="custom-navbar"
    >
      <Container fluid className="align-items-center">
        {/* 🍴 Brand logo */}
        <Navbar.Brand as={NavLink} to="/" className="logo">
          🍴 Gustos
        </Navbar.Brand>

        {/* 🍔 Toggle */}
        <Navbar.Toggle aria-controls="nav" className="hamburger-icon" />

        {/* 🔗 Navigation */}
        <Navbar.Collapse id="nav">
          <Nav className="ms-auto d-flex align-items-center">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/cart" className="nav-link" onClick={closeMenu}>
              Cart
            </NavLink>
            <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
              Admin
            </NavLink>
            <NavLink to="/orders" className="nav-link" onClick={closeMenu}>
              Orders
            </NavLink>
            <NavLink to="/menu" className="nav-link" onClick={closeMenu}>
              Menu
            </NavLink>
            <NavLink
              to="/login"
              className="nav-icon user-icon"
              onClick={closeMenu}
            >
              <img src={UserIcon} alt="Login" />
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
