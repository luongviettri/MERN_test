import UserOrderDetailsPageComponent from './components/UserOrderDetailsPageComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { loadScript } from '@paypal/paypal-js';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { trackPromise } from 'react-promise-tracker';

const getOrder = async (orderId) => {
  const { data } = await trackPromise(orderService.getOrderDetail(orderId));
  return data;
};
//! start: liên quan paypal
const loadPayPalScript = (
  cartSubtotal,
  cartItems,
  orderId,
  updateStateAfterOrder
) => {
  //! cài paypal, optimize: key đặt làm hằng số, value đưa vào biến môi trường
  loadScript({
    'client-id':
      'Ad_wT0KUJQ6O-MXhAFkXYoaJMNzgNW75F2qMWZUBBxbnllt6AsKyqdD_leq_h_Z-XSI5m56pBxt1tUQy',
  })
    .then((paypal) => {
      paypal
        .Buttons(
          buttons(cartSubtotal, cartItems, orderId, updateStateAfterOrder)
        )
        .render('#paypal-container-element');
    })
    .catch((err) => {
      console.error('failed to load the PayPal JS SDK script', err);
    });
};
//! nên tách riêng hàm createOrder trong handler và onApprove trong handler để dễ maintain code, cũng như xử lí async await thay cho promise
const buttons = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
  return {
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            //! tổng tiền
            amount: {
              value: cartSubtotal,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: cartSubtotal,
                },
              },
            },
            //! các product
            items: cartItems.map((product) => {
              return {
                name: product.name,
                unit_amount: {
                  currency_code: 'USD',
                  value: product.price,
                },
                quantity: product.quantity,
              };
            }),
          },
        ],
      });
    },
    onCancel: onCancelHandler,
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        var transaction = orderData.purchase_units[0].payments.captures[0];
        if (
          transaction.status === 'COMPLETED' &&
          Number(transaction.amount.value) === Number(cartSubtotal)
        ) {
          //! nếu như trả đủ tiền rồi thì lên database và update đơn này là đã thanh toán
          updateOrder(orderId)
            .then((data) => {
              if (data.isPaid) {
                updateStateAfterOrder(data.paidAt);
              }
            })
            .catch((er) => console.log(er));
        }
      });
    },
    onError: onErrorHandler,
  };
};
// const createPayPalOrderHandler = function () {
//   console.log('createPayPalOrderHandler');
// };

const onCancelHandler = function () {
  console.log('cancel');
};

// const onApproveHandler = function () {
//   console.log('onApproveHandler');
// };

const onErrorHandler = function (err) {
  console.log('error');
};

const updateOrder = async (orderId) => {
  const { data } = await orderService.updateOrder(orderId);
  return data;
};

//! end: liên quan paypals

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const getUser = async () => {
    const { data } = await trackPromise(userService.getUser(userInfo._id));
    return data;
  };

  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
      loadPayPalScript={loadPayPalScript}
    />
  );
};

export default UserOrderDetailsPage;
