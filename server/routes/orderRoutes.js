const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getLatestOrder,
  getAllOrders,
  updateOrderStatus,
  verifyPayment
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


// USER ROUTES
router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/latest", protect, getLatestOrder);

router.post("/verify-payment", protect, verifyPayment);

// ADMIN ROUTES
router.get("/all", protect, adminOnly, getAllOrders);
router.put("/status/:orderId", protect, adminOnly, updateOrderStatus);


module.exports = router;
