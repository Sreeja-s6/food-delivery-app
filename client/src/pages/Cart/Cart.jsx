import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, food_list, removeItemCompletely, getTotalCartAmount } = useContext(StoreContext);

  const navigate = useNavigate();

  // check if any item exists in cart
  const hasItems = Object.values(cartItems).some((qty) => qty > 0);

  return (
    <div className="cart">

      {/* EMPTY CART MESSAGE */}
      {!hasItems && (
        <div className="empty-cart">
          <h2>Your cart is empty 🛒</h2>
          <p>Add food items to continue</p>
        </div>
      )}

      {/* CART ITEMS TABLE */}
      {hasItems && (
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>

          <br />
          <hr />

          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                      alt={item.name}
                    />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <p
                      onClick={() => removeItemCompletely(item._id)}
                      className="cross"
                    >
                      x
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* TOTAL SECTION (ALWAYS VISIBLE) */}
      <div className="cart-bottom">
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
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 40}
              </b>
            </div>
          </div>

          <button
            disabled={getTotalCartAmount() === 0}
            onClick={() => navigate("/order")}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
