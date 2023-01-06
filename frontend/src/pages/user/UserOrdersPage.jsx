import UserOrdersPageComponent from './components/UserOrdersPageComponent';

import { orderService } from '../../services/orderService';
import { trackPromise } from 'react-promise-tracker';

const getOrders = async () => {
  const { data } = await trackPromise(orderService.getAllOrders());
  return data;
};

const UserOrdersPage = () => {
  return <UserOrdersPageComponent getOrders={getOrders} />;
};

export default UserOrdersPage;
