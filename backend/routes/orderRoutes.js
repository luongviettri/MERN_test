const express = require('express');
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

const router = express.Router();
const {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
} = require('../controllers/orderController');

//! user routes
router.use(verifyIsLoggedIn);
router.route('/').get(getUserOrders).post(createOrder);

router.get('/user/:id', getOrder);
router.put('/paid/:id', updateOrderToPaid);
//! admin routes
router.use(verifyIsAdmin);
router.put('/delivered/:id', updateOrderToDelivered);
router.get('/admin', getOrders);
router.get('/analysis/:date', getOrderForAnalysis);

module.exports = router;
