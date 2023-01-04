import * as actionTypes from '../constants/cartConstants';
import axios from 'axios';

export const addToCartAction =
  (productId, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        productID: data._id,
        name: data.name,
        price: data.price,
        image: data.images[0] ?? null,
        count: data.count,
        quantity: quantity,
      },
    });
    //! để tránh mỗi lần refresh page bị mất giỏ hàng--->  cần phải lưu giỏ hàng vào local storage mỗi khi có hành động add product vào giỏ hàng

    localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems)); //! để truy cập được state từ redux thunk---> thêm getState param vào hàm
  };

export const removeFromCartAction =
  (productID, quantity, price) => (dispatch, getState) => {
    //! dispatch là sync function
    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: { productID: productID, quantity: quantity, price: price },
    });
    localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
  };
