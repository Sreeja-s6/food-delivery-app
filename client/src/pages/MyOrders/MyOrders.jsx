import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      if (!token) return;

      const res = await axiosInstance.get(
        "/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    } catch (error) {
      console.log("Error fetching orders", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="my-orders-container">

      <h2 className="page-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>No orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>

            {/* ===== ORDER HEADER ===== */}
            <div className="order-header">
              <div>
                <p className="order-id">Order ID: {order._id}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </div>

            {/* ===== ORDER ITEMS ===== */}
            <div className="order-items">

              {order.items.map((item) => {

                // If food reference is deleted from DB
                if (!item.food) {
                  return (
                    <div key={item._id} className="order-item">
                      <div>
                        <p className="food-name">
                          Food item no longer available
                        </p>
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
                    />

                    <div>
                      <p className="food-name">{item.food.name}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <p className="price">₹{item.food.price}</p>
                  </div>
                );
              })}

            </div>

            {/* ===== ORDER FOOTER ===== */}
            <div className="order-footer">
              <p>Total Amount: ₹{order.totalAmount}</p>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;