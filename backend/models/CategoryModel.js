const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: 'Default cateogy description',
  },
  image: {
    type: String,
    default: '/images/tablets-category.png',
  },
  attrs: [
    {
      key: String,
      value: [String],
    },
  ],
});

categorySchema.index({ description: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
