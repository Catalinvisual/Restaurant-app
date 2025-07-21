import React, { useEffect, useState, useCallback } from "react";
import "../styles/OrdersPanel.css";

const API_URL = "https://restaurant-app-backend-kvvn.onrender.com";


function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err.message);
    }
  };

  const markDelivered = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/orders/${id}/deliver`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchOrders();
    } catch (err) {
      console.error("❌ Error marking as delivered:", err.message);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...orders];
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.name.toLowerCase().includes(term) ||
          order.email.toLowerCase().includes(term)
      );
    }
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [applyFilters]);

  const totalIncome = orders.reduce((total, order) => {
    const orderTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total + orderTotal;
  }, 0);

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = orders.length - deliveredCount;

  const exportCSV = () => {
    const rows = orders.map((o) => `${o.id},${o.name},${o.email},${o.status}`);
    const content = "ID,Name,Email,Status\n" + rows.join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="orders-panel">
      <h2>📦 My Orders</h2>

      <div className="orders-summary">
        <div className="summary-box">
          <h4>📦 Total Orders</h4>
          <p>{orders.length}</p>
        </div>
        <div className="summary-box">
          <h4>🚚 Delivered</h4>
          <p>{deliveredCount}</p>
        </div>
        <div className="summary-box">
          <h4>🕒 Pending</h4>
          <p>{pendingCount}</p>
        </div>
        <div className="summary-box">
          <h4>💰 Total Income</h4>
          <p>{totalIncome.toFixed(2)} EUR</p>
        </div>
      </div>

      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={exportCSV} className="orange-btn">
          Export CSV
        </button>
      </div>

      {currentOrders.length === 0 ? (
        <div className="no-orders">
          <h3>🚫 No Orders</h3>
          <p>You haven’t placed any orders yet.</p>
          <p>We’ll update you after your first purchase.</p>
        </div>
      ) : (
        currentOrders.map((order) => (
          <div className={`order-card ${order.status.replace(/\s/g, "-")}`} key={order.id}>
            <h3>🧾 Order #{order.id}</h3>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x{item.quantity} – {item.price} €
                </li>
              ))}
            </ul>
            <p><strong>Status:</strong> {order.status}</p>
            <button
              className="orange-btn"
              onClick={() => markDelivered(order.id)}
              disabled={order.status === "delivered"}
            >
              Mark as Delivered
            </button>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`page-btn ${currentPage === idx + 1 ? "active" : ""}`}
              onClick={() => paginate(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPanel;
