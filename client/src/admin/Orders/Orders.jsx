import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./Orders.css";

const STATUS_META = {
  pending:            { color: "#f59e0b", bg: "#fffbeb", icon: "🕐", label: "Pending" },
  confirmed:          { color: "#3b82f6", bg: "#eff6ff", icon: "✅", label: "Confirmed" },
  "out for delivery": { color: "#8b5cf6", bg: "#f5f3ff", icon: "🚴", label: "Out for Delivery" },
  delivered:          { color: "#10b981", bg: "#ecfdf5", icon: "📦", label: "Delivered" },
  cancelled:          { color: "#ef4444", bg: "#fef2f2", icon: "✖",  label: "Cancelled" },
};

// ✅ Strict flow - what comes next
const STATUS_FLOW = {
  "pending":            "confirmed",
  "confirmed":          "out for delivery",
  "out for delivery":   "delivered",
  "delivered":          null,   // no next step
  "cancelled":          null,   // no next step
};

// ✅ Get available options for each status
const getAvailableOptions = (currentStatus) => {
  const options = [currentStatus]; // always include current

  const next = STATUS_FLOW[currentStatus];
  if (next) options.push(next); // add next valid status

  // Allow cancellation only from pending or confirmed
  if (["pending", "confirmed"].includes(currentStatus)) {
    options.push("cancelled");
  }

  return options;
};

const AdminOrders = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter,     setFilter]     = useState("all");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus, currentStatus) => {
    // Prevent selecting same status
    if (newStatus === currentStatus) return;

    setUpdatingId(orderId);
    try {
      await axiosInstance.put(
        `/api/orders/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to "${newStatus}"!`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const STATUS_OPTIONS = ["pending", "confirmed", "out for delivery", "delivered", "cancelled"];
  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const countOf = (s) => orders.filter((o) => o.status === s).length;

  if (loading) {
    return (
      <div className="ao-loading">
        <div className="ao-spinner" />
        <p>Fetching orders…</p>
      </div>
    );
  }

  return (
    <div className="ao-root">

      {/* HEADER */}
      <div className="ao-header">
        <div>
          <h1 className="ao-title">Order Management</h1>
          <p className="ao-subtitle">{orders.length} orders in total</p>
        </div>
        <button className="ao-refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
      </div>

      {/* FILTER CHIPS */}
      <div className="ao-filters">
        <button
          className={`ao-chip ${filter === "all" ? "chip-active" : ""}`}
          style={{ "--c": "#6b7280", "--bg": "#f3f4f6" }}
          onClick={() => setFilter("all")}
        >
          All <span className="chip-num">{orders.length}</span>
        </button>
        {STATUS_OPTIONS.map((s) => {
          const m = STATUS_META[s];
          return (
            <button
              key={s}
              className={`ao-chip ${filter === s ? "chip-active" : ""}`}
              style={{ "--c": m.color, "--bg": m.bg }}
              onClick={() => setFilter(filter === s ? "all" : s)}
            >
              {m.icon} {m.label} <span className="chip-num">{countOf(s)}</span>
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      {filteredOrders.length === 0 ? (
        <div className="ao-empty">
          <span>📭</span>
          <p>No orders here</p>
        </div>
      ) : (
        <div className="ao-cards">
          {filteredOrders.map((order, idx) => {
            const meta       = STATUS_META[order.status] || STATUS_META.pending;
            const isUpdating = updatingId === order._id;
            const d          = new Date(order.createdAt);
            const dateStr    = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            const timeStr    = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

            // ✅ Get only valid next options for this order
            const availableOptions = getAvailableOptions(order.status);

            // ✅ Disable dropdown if delivered or cancelled
            const isTerminal = ["delivered", "cancelled"].includes(order.status);

            return (
              <div className="ao-card" key={order._id} style={{ "--accent": meta.color }}>

                {/* TOP BAR */}
                <div className="ao-card-top">
                  <div className="ao-card-id">
                    <span className="ao-num">#{idx + 1}</span>
                    <span className="ao-hash" title={order._id}>
                      {order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="ao-card-time">
                    <span>{dateStr}</span>
                    <span>{timeStr}</span>
                  </div>
                </div>

                {/* BODY */}
                <div className="ao-card-body">

                  {/* Left */}
                  <div className="ao-col-left">
                    <div className="ao-info-block">
                      <div className="ao-info-label">👤 Customer</div>
                      <div className="ao-customer-name">{order.user?.name || "Unknown"}</div>
                      <div className="ao-customer-email">{order.user?.email || "—"}</div>
                    </div>

                    <div className="ao-info-block">
                      <div className="ao-info-label">📍 Delivery Address</div>
                      <div className="ao-address">{order.address}</div>
                    </div>

                    <div className="ao-info-block">
                      <div className="ao-info-label">💳 Payment</div>
                      <div className="ao-payment-pills">
                        <span className={`ao-method ${order.paymentMethod === "ONLINE" ? "online" : "cod"}`}>
                          {order.paymentMethod === "ONLINE" ? "💳 Online" : "💵 COD"}
                        </span>
                        {order.paymentMethod === "ONLINE" && (
                          <span className={`ao-paid ${order.isPaid ? "paid" : "unpaid"}`}>
                            {order.isPaid ? "✓ Paid" : "✗ Unpaid"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="ao-col-right">
                    <div className="ao-info-block">
                      <div className="ao-info-label">🍽 Items Ordered</div>
                      <div className="ao-items">
                        {order.items.map((item, i) => (
                          <div className="ao-item" key={i}>
                            {item.food?.image && (
                              <img
                                className="ao-item-img"
                                src={`${import.meta.env.VITE_API_URL}/uploads/${item.food.image}`}
                                alt={item.food?.name}
                                onError={(e) => (e.target.style.display = "none")}
                              />
                            )}
                            <span className="ao-item-name">{item.food?.name || "Item"}</span>
                            <span className="ao-item-qty">× {item.quantity}</span>
                            <span className="ao-item-price">
                              ₹{(item.food?.price || 0) * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ao-amount-box">
                      <div className="ao-amount-row">
                        <span>Subtotal</span><span>₹{order.subtotal}</span>
                      </div>
                      <div className="ao-amount-row">
                        <span>Delivery</span>
                        <span>{order.deliveryFee === 0 ? <span className="free">Free 🎉</span> : `₹${order.deliveryFee}`}</span>
                      </div>
                      <div className="ao-amount-row ao-total">
                        <span>Total</span><span>₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="ao-card-footer">
                  <div
                    className="ao-status-badge"
                    style={{ background: meta.bg, color: meta.color, borderColor: meta.color + "44" }}
                  >
                    {meta.icon} {meta.label}
                  </div>

                  <div className="ao-update-group">
                    {isUpdating && <span className="ao-saving">Saving…</span>}

                    {isTerminal ? (
                      /* ✅ Show locked badge for delivered/cancelled — no dropdown */
                      <span className="ao-locked">
                        {meta.icon} {meta.label} (Final)
                      </span>
                    ) : (
                      <select
                        className="ao-select"
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) => updateStatus(order._id, e.target.value, order.status)}
                      >
                        {availableOptions.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_META[s].icon} {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;