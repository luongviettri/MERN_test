import ProductsPageComponent from './components/ProductsPageComponent';
import axios from 'axios';
import { productService } from '../../services/productService';
import { trackPromise } from 'react-promise-tracker';

const fetchProducts = async (abctrl) => {
  const { data } = await trackPromise(
    productService.fetchAllProductsAdmin(abctrl)
  );
  return data;
};

const deleteProduct = async (productId) => {
  const { data } = await trackPromise(productService.deleteProduct(productId));
  return data;
};

const AdminProductsPage = () => {
  return (
    <ProductsPageComponent
      fetchProducts={fetchProducts}
      deleteProduct={deleteProduct}
    />
  );
};

export default AdminProductsPage;
