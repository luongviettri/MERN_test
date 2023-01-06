import { USER_INFORMATION } from '../../utils/config';
import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants';

const userInfoInLocalStorage = localStorage.getItem(USER_INFORMATION)
  ? JSON.parse(localStorage.getItem(USER_INFORMATION))
  : sessionStorage.getItem(USER_INFORMATION)
  ? JSON.parse(sessionStorage.getItem(USER_INFORMATION))
  : {};
const initialState = {
  userInfo: userInfoInLocalStorage,
};
export const userRegisterLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        userInfo: action.payload,
      };
    case LOGOUT_USER:
      return {};

    default:
      return state;
  }
};
