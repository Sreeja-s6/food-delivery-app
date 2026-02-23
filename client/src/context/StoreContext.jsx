import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL FOOD ================= */
  const fetchFoods = async () => {
    try {
      const res = await axiosInstance.get("/api/food");
      setFoodList(res.data);
    } catch (error) {
      console.log("Error fetching foods", error);
    }
  };

  /* ================= FETCH USER CART ================= */
  const fetchCart = async () => {
    try {
      if (!token) return;

      const res = await axiosInstance.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });

      let cartData = {};
      res.data.items.forEach(item => {
        cartData[item.food._id] = item.quantity;
      });

      setCartItems(cartData);

    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCart();
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId) => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      await axiosInstance.post(
        "/api/cart/add",
        { foodId: itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev => ({
        ...prev,
        [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
      }));

    } catch (error) {
      console.log("Add to cart failed", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  /* ================= DECREASE QUANTITY ================= */
  const decreaseQuantity = async (itemId) => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      const currentQty = cartItems[itemId];

      // If quantity is 1 → remove completely
      if (currentQty <= 1) {
        await removeItemCompletely(itemId);
        return;
      }

      await axiosInstance.put(
        "/api/cart/update",
        {
          foodId: itemId,
          quantity: currentQty - 1
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev => ({
        ...prev,
        [itemId]: prev[itemId] - 1
      }));

    } catch (error) {
      console.log("Decrease failed", error);
    }
  };

  /* ================= REMOVE ITEM COMPLETELY ================= */
  const removeItemCompletely = async (itemId) => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      await axiosInstance.delete(
        `/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });

    } catch (error) {
      console.log("Remove failed", error);
    }
  };

  /* ================= CLEAR CART AFTER ORDER ================= */
  const clearCart = () => {
    setCartItems({});
  };

  /* ================= TOTAL CART AMOUNT ================= */
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      const itemInfo = food_list.find(product => product._id === item);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }

    return totalAmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    decreaseQuantity,
    removeItemCompletely,
    clearCart,
    getTotalCartAmount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;