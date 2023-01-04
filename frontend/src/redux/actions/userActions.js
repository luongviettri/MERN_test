import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants';
import axios from 'axios';
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
export const logout = () => (dispatch) => {
  document.location.href = '/login';
  axios.get('/api/logout');
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('userInfo');
  localStorage.removeItem('cart');
  dispatch({ type: LOGOUT_USER });
};
