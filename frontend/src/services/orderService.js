import { baseService } from './baseService';

class OrderService extends baseService {
  constructor() {
    super();
  }
  //! get all orders của user đang login
  getAllOrders = () => {
    return this.get('api/orders');
  };

  //! get all orders của all users cho admin---> nên làm tính năng pagination ở backend để list ra từng phần cho thực tế

  getAllOrdersAdmin = () => {
    return this.get('api/orders/admin');
  };

  createOrder = (orderData) => {
    return this.post('api/orders', { ...orderData });
  };

  getOrderDetail = (orderId) => {
    return this.get('api/orders/user/' + orderId);
  };

  updateOrder = (orderId) => {
    return this.put('api/orders/paid/' + orderId);
  };

  fetchOrdersForAnalysis = (abortController, dayToCompare) => {
    return this.get('api/orders/analysis/' + dayToCompare, {
      signal: abortController.signal,
    });
  };

  markAsDelivered = (orderID) => {
    return this.put('/api/orders/delivered/' + orderID);
  };
}
export const orderService = new OrderService();
