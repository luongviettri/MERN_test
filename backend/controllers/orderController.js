const { ObjectId } = require('mongodb');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
//! getUserOrders: tìm ra các orders thuộc về userID này và trả về client
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: ObjectId(req.user._id) });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', '-password -isAdmin -_id -__v -createdAt -updatedAt')
      .orFail();
    res.send(order);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    //! lấy và check thông tin được gửi lên từ client
    const { cartItems, orderTotal, paymentMethod } = req.body;
    if (!cartItems || !orderTotal || !paymentMethod) {
      return res.status(400).send('All inputs are required');
    }
    //! lấy ID và quantity để đưa vào sales trong product. note that: 1 order may have many products
    const ids = cartItems.map((item) => {
      return item.productID;
    });

    const qty = cartItems.map((item) => {
      return Number(item.quantity);
    });
    //! thực hiện tăng sales trong product..... nên có cách tối ưu code
    await Product.find({ _id: { $in: ids } }).then((products) => {
      products.forEach((product, idx) => {
        product.sales += qty[idx];
        product.save();
      });
    });

    //! xử lý thêm order
    const order = new Order({
      user: ObjectId(req.user._id),
      orderTotal: orderTotal, //todo: tổng tiền
      cartItems: cartItems, //todo: mảng đơn hàng
      paymentMethod: paymentMethod, //todo: paypal hay thanh toán khi nhận hàng
    });

    const createdOrder = await order.save();
    res.status(201).send(createdOrder);
  } catch (error) {
    next(error);
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', '-password')
      .sort({ paymentMethod: 'desc' });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderForAnalysis = async (req, res, next) => {
  try {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);
    const order = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: 'asc' });
    res.send(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
};
