const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all active categories (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/categories/entrepreneurs/:categoryId
// @desc    Get approved entrepreneurs for a category (for service request)
// @access  Public
router.get('/entrepreneurs/:categoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Find approved sellers whose skills might match or just return all approved sellers
    const entrepreneurs = await User.find({
      role: 'seller',
      isApproved: true,
    }).select('-password');
    res.json(entrepreneurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/categories/entrepreneur/:id
// @desc    Get a single entrepreneur's public profile
// @access  Public
router.get('/entrepreneur/:id', async (req, res) => {
  try {
    const entrepreneur = await User.findById(req.params.id).select('-password');
    if (!entrepreneur || entrepreneur.role !== 'seller') {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }
    res.json(entrepreneur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
