const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, authorize } = require('../middleware/auth');

// All admin routes: protect + authorize('admin')

// @route   GET /api/admin/analytics
// @desc    Platform analytics/stats
// @access  Private/Admin
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'buyer' });
    const totalEntrepreneurs = await User.countDocuments({ role: 'seller' });
    const pendingApprovals = await User.countDocuments({ role: 'seller', isApproved: false });
    const totalOrders = await Order.countDocuments();
    const totalServiceRequests = await ServiceRequest.countDocuments();

    // Calculate total revenue from orders
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalUsers,
      totalEntrepreneurs,
      pendingApprovals,
      totalOrders,
      totalServiceRequests,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/entrepreneurs/pending
// @desc    List unapproved entrepreneurs
// @access  Private/Admin
router.get('/entrepreneurs/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const pending = await User.find({ role: 'seller', isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/entrepreneurs/:id/approve
// @desc    Approve an entrepreneur
// @access  Private/Admin
router.put('/entrepreneurs/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'seller') {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Entrepreneur approved', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/entrepreneurs/:id/reject
// @desc    Reject an entrepreneur (set isApproved to false)
// @access  Private/Admin
router.put('/entrepreneurs/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'seller') {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }
    user.isApproved = false;
    await user.save();
    res.json({ message: 'Entrepreneur rejected', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/categories
// @desc    List all categories
// @access  Private/Admin
router.get('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/categories
// @desc    Create a category
// @access  Private/Admin
router.post('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/categories/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/categories/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/service-requests
// @desc    List all service requests (admin overview)
// @access  Private/Admin
router.get('/service-requests', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name email avatar city')
      .populate('entrepreneur', 'name email avatar city shopName skills')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
