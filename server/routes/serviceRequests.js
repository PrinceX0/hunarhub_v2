const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/service-requests
// @desc    Customer creates a service request
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { entrepreneurId, categoryId, description, requestedDate, preferredTime, location } = req.body;

    const entrepreneur = await User.findById(entrepreneurId);
    if (!entrepreneur || entrepreneur.role !== 'seller') {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }

    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      entrepreneur: entrepreneurId,
      category: categoryId,
      description,
      requestedDate,
      preferredTime,
      location: location || req.user.city || '',
    });

    const populated = await ServiceRequest.findById(serviceRequest._id)
      .populate('customer', 'name email avatar city')
      .populate('entrepreneur', 'name avatar shopName')
      .populate('category', 'name icon');

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/service-requests/my
// @desc    Customer's own service requests
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate('entrepreneur', 'name avatar shopName city skills')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/service-requests/entrepreneur
// @desc    Entrepreneur's incoming service requests
// @access  Private/Seller
router.get('/entrepreneur', protect, authorize('seller'), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ entrepreneur: req.user._id })
      .populate('customer', 'name email avatar city')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/service-requests/:id/accept
// @desc    Entrepreneur accepts a service request
// @access  Private/Seller
router.put('/:id/accept', protect, authorize('seller'), async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    if (request.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = 'accepted';
    await request.save();

    const populated = await ServiceRequest.findById(request._id)
      .populate('customer', 'name email avatar city')
      .populate('category', 'name icon');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/service-requests/:id/reject
// @desc    Entrepreneur rejects a service request
// @access  Private/Seller
router.put('/:id/reject', protect, authorize('seller'), async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    if (request.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = 'rejected';
    await request.save();

    const populated = await ServiceRequest.findById(request._id)
      .populate('customer', 'name email avatar city')
      .populate('category', 'name icon');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/service-requests/:id/complete
// @desc    Mark service request as completed
// @access  Private/Seller
router.put('/:id/complete', protect, authorize('seller'), async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    if (request.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = 'completed';
    await request.save();

    const populated = await ServiceRequest.findById(request._id)
      .populate('customer', 'name email avatar city')
      .populate('category', 'name icon');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
