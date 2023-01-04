import UserOrdersPageComponent from './components/UserOrdersPageComponent';

import axios from 'axios';
import { orderService } from '../../services/orderService';

const getOrders = async () => {
  const { data } = await orderService.getAllOrders();
  return data;
};

const UserOrdersPage = () => {
  return <UserOrdersPageComponent getOrders={getOrders} />;
};

export default UserOrdersPage;
