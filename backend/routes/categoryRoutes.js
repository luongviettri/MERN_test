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

router.get('/', getCategories); //! tạm thời chuyển lên đây vì lấy categories đâu cần phải có quyền admin ?
router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.post('/', newCategory);
router.delete('/:category', deleteCategory);
router.post('/attr', saveAttr);

module.exports = router;
