import UserCartDetailsPageComponent from './components/UserCartDetailsPageComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCartAction,
  removeFromCartAction,
} from '../../redux/actions/cartActions';
import axios from 'axios';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';

const UserCartDetailsPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);
  const reduxDispatch = useDispatch();
  const getUser = async () => {
    const { data } = await userService.getUser(userInfo._id);

    return data;
  };

  const createOrder = async (orderData) => {
    const { data } = await orderService.createOrder(orderData);
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
