import OrderDetailsPageComponent from './components/OrderDetailsPageComponent';

import axios from 'axios';
import { orderService } from '../../services/orderService';

const getOrder = async (id) => {
  const { data } = await orderService.getOrderDetail(id);
  return data;
};

const markAsDelivered = async (orderID) => {
  const { data } = await orderService.markAsDelivered(orderID);
  if (data) {
    return data;
  }
};

const AdminOrderDetailsPage = () => {
  return (
    <OrderDetailsPageComponent
      getOrder={getOrder}
      markAsDelivered={markAsDelivered}
    />
  );
};

export default AdminOrderDetailsPage;
