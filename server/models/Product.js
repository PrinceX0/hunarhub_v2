const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Textiles', 'Pottery', 'Woodwork', 'Metal Art', 'Paintings', 'Jewellery', 'Food', 'Home Decor'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  artisanName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
