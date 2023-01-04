import { proceedFilters } from '../utils/proceedFilter';
import { baseService } from './baseService';

class ProductService extends baseService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }
  getBestsellers = () => {
    return this.get(`api/products/bestsellers`);
  };

  getProductDetail = (productID) => {
    return this.get(`api/products/get-one/${productID}`);
  };

  writeReview = (productId, formInputs) => {
    return this.post(`api/users/review/${productId}`, {
      ...formInputs,
    });
  };

  getProductsQuery = (
    categoryName = '',
    pageNumParam = null,
    searchQuery = '',
    filters = {},
    sortOption = ''
  ) => {
    //   filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,d&attrs=color-red-blue,size-1TB-2TB";
    const filtersUrl = proceedFilters(filters);
    const search = searchQuery ? `search/${searchQuery}/` : '';
    const category = categoryName ? `category/${categoryName}/` : '';
    const url = `api/products/${category}${search}?pageNum=${pageNumParam}${filtersUrl}&sort=${sortOption}`;
    return this.get(url);
  };

  createProduct = (formInputs) => {
    return this.post(`api/products/admin`, { ...formInputs });
  };

  updateProduct = (productId, formInputs) => {
    return this.put(`api/products/admin/${productId}`, {
      ...formInputs,
    });
  };
  fetchProduct = (productId) => {
    return this.get(`api/products/get-one/${productId}`);
  };

  deleteProduct = (productId) => {
    return this.delete(`api/products/admin/${productId}`);
  };

  //! nên tạo tính năng pagination và lấy từng phần để cho thực tế
  fetchAllProductsAdmin = (abortController) => {
    return this.get('api/products/admin', {
      signal: abortController.signal,
    });
  };
}
export const productService = new ProductService();
