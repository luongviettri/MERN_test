import ProductListPageComponent from './components/ProductListPageComponent';

import { useSelector } from 'react-redux';

const ProductListPage = () => {
  const { categories } = useSelector((state) => state.getCategoriesReducer);

  return <ProductListPageComponent categories={categories} />;
};

export default ProductListPage;
