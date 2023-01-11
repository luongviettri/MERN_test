const express = require('express');

const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

const router = express.Router();
const {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
  getProductsRefactor,
} = require('../controllers/productController');

const productController = require('../controllers/productController');

// router.get(
//   // '/category/:categoryName/search/:searchQuery',
//   `/category/:categoryName/search/:searchQuery`,
//   searchCategoryAndProducts
// ); //! refactor ham rieng

router.get(
  '/category/:categoryName/search/:searchQuery',
  productController.getProducts
);
router.get('/category/:categoryName', productController.getProducts);
router.get('/search/:searchQuery', productController.getProducts);

// router.get('/', getProducts); //! tạm thời dùng
router.get('/', productController.getProductsRefactor); //!  đã refactor nhưng cần tiếp tục tách phần param

// router.get('/testRefactor', getProductsRefactor);

router.get('/bestsellers', productController.getBestsellers);
router.get('/get-one/:id', productController.getProductById);
//! admin routes
router.use(verifyIsLoggedIn); //! log in
router.use(verifyIsAdmin); //! admin

router
  .route('/admin')
  .get(productController.adminGetProducts)
  .post(productController.adminCreateProduct);

router
  .route('/admin/:id')
  .put(productController.adminUpdateProduct)
  .delete(productController.adminDeleteProduct);

router.delete(
  '/admin/image/:imagePath/:productId',
  productController.adminDeleteProductImage
);
router.post('/admin/upload', productController.adminUpload);

module.exports = router;
