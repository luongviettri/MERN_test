import axios from 'axios';
import { orderService } from '../../services/orderService';
import OrdersPageComponent from './components/OrdersPageComponent';

const getOrders = async () => {
  const { data } = await orderService.getAllOrdersAdmin();
  return data;
};

const AdminOrdersPage = () => {
  return <OrdersPageComponent getOrders={getOrders} />;
};

export default AdminOrdersPage;
