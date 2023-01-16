import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants';
import axios from 'axios';
import catchAsync from '../../utils/catchAsync';
//! phần này nên đặt là authen, autho
//2 set login
export const loginAction = (userCreated) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_USER,
      payload: userCreated,
    });
  };
};
//2 set logout
export const logout = () =>
  catchAsync(async (dispatch) => {
    console.log('1. vô đây để gọi API');

    await axios.get('/api/logout');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    localStorage.removeItem('cart');

    document.location.href = '/login';
    dispatch({ type: LOGOUT_USER });
  });
