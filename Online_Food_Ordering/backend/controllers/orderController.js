import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

// @route   POST /api/orders
// @desc    Create a new order (User must be authenticated)
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = req.user.id;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Please provide valid order items" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Please provide valid total amount" });
    }

    if (!address) {
      return res.status(400).json({ message: "Please provide delivery address" });
    }

    // Verify all menu items exist and get prices
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItem} not found` });
      }

      const itemTotal = menuItem.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Verify total amount matches
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ message: "Order total amount mismatch" });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      address,
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    await order.save();
    await order.populate("user", "name email");
    await order.populate("items.menuItem");

    res.status(201).json({
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/my
// @desc    Get logged-in user's orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders retrieved successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/:id
// @desc    Get order details by ID
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    // Validation
    const validOrderStatus = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    const validPaymentStatus = ["Pending", "Paid", "Failed"];

    if (orderStatus && !validOrderStatus.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (paymentStatus && !validPaymentStatus.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Find and update order
    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders (Admin only)
// @desc    Get all orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders retrieved successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
