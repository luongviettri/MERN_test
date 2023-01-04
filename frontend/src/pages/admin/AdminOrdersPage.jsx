import axios from 'axios';
import { orderService } from '../../services/orderService';
import OrdersPageComponent from './components/OrdersPageComponent';
import { trackPromise } from 'react-promise-tracker';

const getOrders = async () => {
  const { data } = await trackPromise(orderService.getAllOrdersAdmin());
  return data;
};

const AdminOrdersPage = () => {
  return <OrdersPageComponent getOrders={getOrders} />;
};

export default AdminOrdersPage;
