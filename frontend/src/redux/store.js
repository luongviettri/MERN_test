import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { counterReducer } from './reducers/cartReducers';
import { userRegisterLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
  //! reducer nên để tên cũ luôn
  cart: counterReducer,
  userRegisterLogin: userRegisterLoginReducer,
});

//! tối ưu lại đoạn này
const userInfoInLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo'))
  : {};

//! tối ưu lại đoạn này, mỗi reducer nên có state riêng chứ ko viết chung
const INITIAL_STATE = {
  cart: {
    value: 0,
  },
  userRegisterLogin: { userInfo: userInfoInLocalStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  INITIAL_STATE,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
