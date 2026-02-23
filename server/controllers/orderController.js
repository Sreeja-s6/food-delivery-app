const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { address, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate("items.food");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // ✅ Calculate subtotal
        let subtotal = 0;

        const orderItems = cart.items.map((item) => {
            subtotal += item.food.price * item.quantity;

            return {
                food: item.food._id,
                quantity: item.quantity,
            };
        });

        // ✅ Delivery logic
        let deliveryFee = 0;

        if (subtotal === 0) {
            deliveryFee = 0;
        } else if (subtotal >= 500) {
            deliveryFee = 0;
        } else {
            deliveryFee = 40;
        }

        const totalAmount = subtotal + deliveryFee;

        const order = new Order({
            user: userId,
            items: orderItems,
            subtotal,
            deliveryFee,
            totalAmount,
            address,
            paymentMethod,
            status: "pending"
        });

        // ================= COD =================
        if (paymentMethod === "COD") {

            order.isPaid = false;
            order.status = "pending";

            await order.save();
            await Cart.findOneAndDelete({ user: userId });

            return res.status(201).json({
                message: "Order placed successfully",
                orderId: order._id
            });
        }

        // ================= ONLINE =================
        else if (paymentMethod === "ONLINE") {

            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            });

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            return res.status(200).json({
                success: true,
                orderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: totalAmount * 100,
                key: process.env.RAZORPAY_KEY_ID
            });
        }

        else {
            return res.status(400).json({ message: "Invalid payment method" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Order placement failed" });
    }
};

// ================= GET USER ORDERS =================
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({ user: userId })
            .populate("items.food", "name price image")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Fetching orders failed" });
    }
};

// ================= GET LATEST ORDER =================
exports.getLatestOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const order = await Order.findOne({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.food", "name price image");

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Fetching latest order failed" });
    }
};

// ================= ADMIN: GET ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food", "name price image")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Fetching all orders failed" });
    }
};

// ================= ADMIN: UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Status update failed" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {

            const order = await Order.findById(orderId);

            order.isPaid = true;
            order.status = "confirmed";
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;

            await order.save();

            await Cart.findOneAndDelete({ user: order.user });

            return res.json({ success: true, message: "Payment verified" });

        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        res.status(500).json({ message: "Payment verification failed" });
    }
};