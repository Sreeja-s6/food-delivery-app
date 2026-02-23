const express = require("express");
const router = express.Router();

const foodController = require("../controllers/foodController");
const upload = require("../config/multer");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// PUBLIC ROUTES
router.get("/", foodController.getAllFood);
router.get("/:id", foodController.getFoodById);

// ADMIN ROUTES
router.post("/", protect, adminOnly, upload.single("image"), foodController.createFood);

router.put("/:id", protect, adminOnly, upload.single("image"), foodController.updateFood);

router.delete("/:id", protect, adminOnly, foodController.deleteFood);

module.exports = router;