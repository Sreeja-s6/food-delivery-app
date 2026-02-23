const Cart = require("../models/Cart");
const Food = require("../models/Food");

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { foodId, quantity } = req.body;

        // Convert quantity to number
        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json({ message: "Food not found" });

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: userId,
                items: [{ food: foodId, quantity: quantityNumber }]
            });
        } else {
            // Check if item already exists
            const itemIndex = cart.items.findIndex(
                item => item.food.toString() === foodId
            );

            if (itemIndex > -1) {
                // Increase quantity
                cart.items[itemIndex].quantity += quantityNumber;
            } else {
                // Add new item
                cart.items.push({ food: foodId, quantity: quantityNumber });
            }
        }

        await cart.save();

        res.status(200).json({
            message: "Item added to cart",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Add to cart failed" });
    }
};

// Get user cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.food", "name price image");

        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Fetching cart failed" });
    }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { foodId, quantity } = req.body;

        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            item => item.food.toString() === foodId
        );

        if (itemIndex === -1)
            return res.status(404).json({ message: "Item not in cart" });

        cart.items[itemIndex].quantity = quantityNumber;
        await cart.save();

        res.json({ message: "Quantity updated", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Update failed" });
    }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { foodId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => item.food.toString() !== foodId
        );

        await cart.save();

        res.json({ message: "Item removed", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Remove failed" });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(400).json({ message: "Cart is already empty" });

        await Cart.findOneAndDelete({ user: userId });

        res.json({ message: "Cart cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Clear cart failed" });
    }
};
