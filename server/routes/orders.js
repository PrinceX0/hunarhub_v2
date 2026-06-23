const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place a new order (buyer)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = await Order.create({
      buyer: req.user._id,
      product: productId,
      seller: product.seller,
      quantity: quantity || 1,
      totalPrice: product.price * (quantity || 1),
      shippingAddress,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'title images price')
      .populate('seller', 'name shopName');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get buyer's orders
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('product', 'title images price artisanName')
      .populate('seller', 'name shopName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/seller
// @desc    Get seller's incoming orders
// @access  Private/Seller
router.get('/seller', protect, authorize('seller'), async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('product', 'title images price')
      .populate('buyer', 'name email city')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (seller)
// @access  Private/Seller
router.put('/:id/status', protect, authorize('seller'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = req.body.status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('product', 'title images price')
      .populate('buyer', 'name email');

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
