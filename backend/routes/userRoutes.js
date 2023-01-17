const express = require('express');
const {
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  writeReview,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const rateLimitController = require('../middleware/rateLimitController');
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

const router = express.Router();

//! not logged in routes
router.post('/register', registerUser);
// router.post('/login', loginUser);
router.post('/login', rateLimitController.loginRouteRateLimit);

//! user logged in routes:
router.use(verifyIsLoggedIn);
router.put('/profile', updateUserProfile);
router.get('/profile/:id', getUserProfile); //todo: instructor: route này dùng để lấy user info rồi user mới edit info đó--> rồi mới sử dụng route put ở trên
router.post('/review/:productId', writeReview);

//! admin routes:
router.use(verifyIsAdmin);
router.get('/', getUsers);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
