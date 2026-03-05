import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axiosInstance from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"


function PlaceOrder() {

  const { getTotalCartAmount, clearCart } = useContext(StoreContext)
  const navigate = useNavigate()

  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/orders/place",
        { address, paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 🟢 COD FLOW
      if (paymentMethod === "COD") {

        toast.success("Order placed successfully! 🎉");

        clearCart();  // clear cart immediately

        setTimeout(() => {
          navigate("/my-orders");
        }, 2000);  // redirect after 2 seconds
      }

      // 🟢 ONLINE FLOW
      if (paymentMethod === "ONLINE") {

        const { razorpayOrderId, amount, key, orderId } = res.data;
        const options = {
          key,
          amount,
          currency: "INR",
          name: "Food Delivery",
          description: "Order Payment",
          order_id: razorpayOrderId,

          handler: async function (response) {

            await axiosInstance.post(
              "/api/orders/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            clearCart();
            navigate("/my-orders");
          },

          prefill: {
            name: "Test User",
            email: "test@gmail.com"
          },

          theme: {
            color: "#3399cc"
          }
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }

    } catch (error) {
      console.log(error);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='place-order' onSubmit={handlePlaceOrder}>

      {/* LEFT SIDE */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <textarea
          className="place-order-textarea"
          placeholder="Enter full delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <p style={{ marginTop: "20px", fontWeight: "600" }}>Payment Method</p>

        <select
          className="place-order-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>
      </div>

      {/* RIGHT SIDE */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 40}
              </b>
            </div>
          </div>

          <button disabled={loading}>
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
