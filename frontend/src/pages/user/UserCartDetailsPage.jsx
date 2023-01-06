import UserCartDetailsPageComponent from './components/UserCartDetailsPageComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCartAction,
  removeFromCartAction,
} from '../../redux/actions/cartActions';
import axios from 'axios';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { trackPromise } from 'react-promise-tracker';

const UserCartDetailsPage = () => {
  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  const itemsCount = useSelector((state) => state.cartReducer.itemsCount);
  const cartSubtotal = useSelector((state) => state.cartReducer.cartSubtotal);
  const userInfo = useSelector(
    (state) => state.userRegisterLoginReducer.userInfo
  );
  const reduxDispatch = useDispatch();
  const getUser = async () => {
    const { data } = await trackPromise(userService.getUser(userInfo._id));

    return data;
  };

  const createOrder = async (orderData) => {
    const { data } = await trackPromise(orderService.createOrder(orderData));
    return data;
  };

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      addToCartAction={addToCartAction}
      removeFromCartAction={removeFromCartAction}
      reduxDispatch={reduxDispatch}
      userInfo={userInfo}
      getUser={getUser}
      createOrder={createOrder}
    />
  );
};

export default UserCartDetailsPage;
