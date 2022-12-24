const connectDB = require('../config/db');

connectDB();

const categoryData = require('./categories');
const productData = require('./products');
const reviewData = require('./reviews');
const userData = require('./users');
const orderData = require('./orders');

const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');

const importData = async () => {
  try {
    await Category.collection.dropIndexes();
    await Product.collection.dropIndexes();

    await Category.collection.deleteMany({});
    await Product.collection.deleteMany({});
    await Review.collection.deleteMany({});
    await User.collection.deleteMany({});
    await Order.collection.deleteMany({});

    await Category.insertMany(categoryData);
    const reviews = await Review.insertMany(reviewData);
    const sampleProducts = productData.map((product) => {
      // eslint-disable-next-line array-callback-return
      reviews.map((review) => {
        product.reviews.push(review._id);
      });
      console.log('product: ', product);
      return { ...product };
    });
    await Product.insertMany(sampleProducts);
    await User.insertMany(userData);
    await Order.insertMany(orderData);

    console.log('Seeder data proceeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error while proccessing seeder data', error);
    process.exit(1);
  }
};
importData();
