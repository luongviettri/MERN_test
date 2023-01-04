import CartPageComponent from './components/CartPageComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCartAction,
  removeFromCartAction,
} from '../redux/actions/cartActions';
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
  const dispatch = useDispatch();
  return (
    <CartPageComponent
      addToCartAction={addToCartAction}
      removeFromCartAction={removeFromCartAction}
      cartItems={cartItems}
      cartSubtotal={cartSubtotal}
      dispatch={dispatch}
    />
  );
};

export default CartPage;
