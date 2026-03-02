import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./MyOrders.css";
import { useTheme } from "../../context/ThemeContext";
import { Container, Badge, Spinner } from "react-bootstrap";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { darkMode } = useTheme();

  const fetchOrders = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(res.data);

    } catch (error) {
      console.log("Error fetching orders", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Refetch when user comes back to this tab
    const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            fetchOrders();
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "tomato" }} />
        <p>Loading your orders...</p>
      </div>
    );
  }

  // ORDER TRACKING STEPS
  const trackingSteps = ["pending", "confirmed", "out for delivery", "delivered"];

  const getStepIndex = (status) => trackingSteps.indexOf(status);

  return (
    <Container className={`my-orders-container ${darkMode ? "dark" : ""}`}>

      <h2 className="page-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className={`empty-orders ${darkMode ? "dark" : ""}`}>
          <p>🛒 No orders yet! Start ordering your favourite food.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div className={`order-card ${darkMode ? "dark" : ""}`} key={order._id}>

            {/* ORDER HEADER */}
            <div className="order-header">
              <div>
                <p className="order-id">Order ID: {order._id}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge
                className={`status ${order.status}`}
                style={{
                  textTransform: "capitalize",
                  fontSize: "13px",
                  padding: "8px 14px",
                  borderRadius: "20px"
                }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            {/* ORDER TRACKING TIMELINE */}
            {order.status !== "cancelled" && (
              <div className="order-tracking">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="tracking-step">
                    <div className={`tracking-dot ${getStepIndex(order.status) >= index ? "completed" : ""}`}>
                      {getStepIndex(order.status) >= index ? "✓" : index + 1}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`tracking-line ${getStepIndex(order.status) > index ? "completed" : ""}`} />
                    )}
                    <p className={`tracking-label ${getStepIndex(order.status) >= index ? "completed" : ""}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* DELIVERY INFO */}
            <div className={`order-delivery-info ${darkMode ? "dark" : ""}`}>
              <p>
                📍 <span className="info-label">Delivery Address:</span> {order.address}
              </p>
              <p>
                💳 <span className="info-label">Payment:</span> {order.paymentMethod === "ONLINE" ? "Online Payment" : "Cash on Delivery"}
                {order.paymentMethod === "ONLINE" && (
                  <span className={order.isPaid ? "paid-badge" : "unpaid-badge"}>
                    {order.isPaid ? " ✓ Paid" : " ✗ Unpaid"}
                  </span>
                )}
              </p>
              <p>
                🛵 <span className="info-label">Delivery Fee:</span>{" "}
                {order.deliveryFee === 0 ? (
                  <span className="free-delivery">Free 🎉</span>
                ) : (
                  `₹${order.deliveryFee}`
                )}
              </p>
            </div>

            {/* ORDER ITEMS */}
            <div className="order-items">
              <p className="items-title">Items Ordered</p>
              {order.items.map((item) => {
                if (!item.food) {
                  return (
                    <div key={item._id} className="order-item">
                      <div>
                        <p className="food-name">Food item no longer available</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item._id} className="order-item">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${item.food.image}`}
                      alt={item.food.name}
                      onError={(e) => e.target.style.display = "none"}
                    />
                    <div>
                      <p className="food-name">{item.food.name}</p>
                      <p className="food-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="price">₹{item.food.price * item.quantity}</p>
                  </div>
                );
              })}
            </div>

            {/* ORDER FOOTER */}
            <div className="order-footer">
              <div className="footer-row">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="footer-row">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="footer-row total">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

          </div>
        ))
      )}
    </Container>
  );
}

export default MyOrders;