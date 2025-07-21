import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';
import Cart from './Cart';
import { CartProvider } from './CartContext';
import Success from './Succes'; // renamed from Succes
import AddProduct from './AddProduct';
import '../styles/App.css';
import ProductList from './ProductList';
import AppNavbar from '../components/Navbar';
import OrdersPanel from '../components/OrdersPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from '../components/ResetPassword';
import Menu from '../components/Menu';
import WhatsAppButton from '../components/WhatsAppButton';

function App() {
  return (
    <CartProvider>
      <AppNavbar />

      {/* 🔘 WhatsApp floating button */}
      <WhatsAppButton />

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/success" element={<Success />} /> {/* updated path and component */}
          <Route path="/admin/add" element={<AddProduct />} />
          <Route path="/products" element={<ProductList />} /> {/* translated route */}
          <Route path="/orders" element={<OrdersPanel />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </Container>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </CartProvider>
  );
}

export default App;