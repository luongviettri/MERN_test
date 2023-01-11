const mongoose = require('mongoose');
const Review = require('./ReviewModel');

const imageSchema = mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
});

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    reviewsNumber: {
      type: Number,
    },
    sales: {
      type: Number,
      default: 0,
    },
    attrs: [{ key: String, value: String }],
    images: [imageSchema],
    // reviews: [ //! lâu lâu bị lỗi thì dùng cái này
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // ref: 'Review',
    //     ref: Review,
    //   },
    // ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// productSchema.index();

const Product = mongoose.model('Product', productSchema);

productSchema.index(
  { name: 'text', description: 'text' },
  { name: 'TextIndex' } //! đặt tên cho index: https://www.mongodb.com/docs/manual/tutorial/avoid-text-index-name-limit/
);

productSchema.index({ 'atts.key': 1, 'atts.value': 1 });

module.exports = Product;
