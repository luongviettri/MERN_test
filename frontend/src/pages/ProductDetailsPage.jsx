import { useDispatch, useSelector } from 'react-redux';
import { addToCartAction } from '../redux/actions/cartActions';
import ProductDetailsPageComponent from './components/ProductDetailsPageComponent';
import axios from 'axios';
import { productService } from '../services/productService';

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  return (
    <ProductDetailsPageComponent
      addToCartAction={addToCartAction}
      dispatch={dispatch}
      userInfo={userInfo}
    />
  );
};

export default ProductDetailsPage;
