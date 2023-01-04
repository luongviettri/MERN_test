import AnalyticsPageComponent from './components/AnalyticsPageComponent';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { orderService } from '../../services/orderService';

const fetchOrdersForFirstDate = async (abctrl, firstDateToCompare) => {
  const { data } = await orderService.fetchOrdersForAnalysis(
    abctrl,
    firstDateToCompare
  );
  return data;
};

const fetchOrdersForSecondDate = async (abctrl, secondDateToCompare) => {
  const { data } = await orderService.fetchOrdersForAnalysis(
    abctrl,
    secondDateToCompare
  );
  return data;
};

const AdminAnalyticsPage = () => {
  return (
    <AnalyticsPageComponent
      fetchOrdersForFirstDate={fetchOrdersForFirstDate}
      fetchOrdersForSecondDate={fetchOrdersForSecondDate}
      socketIOClient={socketIOClient}
    />
  );
};

export default AdminAnalyticsPage;
