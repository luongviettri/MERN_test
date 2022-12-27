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
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

const router = express.Router();

//! not logged in routes
router.post('/register', registerUser);
router.post('/login', loginUser);

//! user logged in routes:
router.use(verifyIsLoggedIn);
router.put('/profile', updateUserProfile);
router.get('/profile/:id', getUserProfile); //todo: instructor: route này dùng để lấy user info rồi user mới edit info đó--> rồi mới sử dụng route put ở trên
router.post('/review/:productId', writeReview);

//! admin routes:
router.use(verifyIsAdmin);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
