const express = require('express');

const router = express.Router();
const {
  getCategories,
  newCategory,
  deleteCategory,
  saveAttr,
} = require('../controllers/categoryController');
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.get('/', getCategories);
router.post('/', newCategory);
router.delete('/:category', deleteCategory);
router.post('/attr', saveAttr);

module.exports = router;
