const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.put("/update", protect, cartController.updateQuantity);
router.delete("/remove/:foodId", protect, cartController.removeItem);
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;
