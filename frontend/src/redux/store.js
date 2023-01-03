import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { adminChatReducer } from './reducers/adminChatReducers';
import { cartReducer } from './reducers/cartReducers';
import { getCategoriesReducer } from './reducers/categoryReducers';
import { userRegisterLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
  //! reducer nên để tên cũ luôn
  cart: cartReducer,
  userRegisterLogin: userRegisterLoginReducer,
  getCategories: getCategoriesReducer,
  adminChat: adminChatReducer,
});

//! hành động vào trong localStorage tìm giỏ hàng để đưa vào trang, cần tối ưu trong reducer riêng
const cartItemsInLocalStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

//! tối ưu lại = reducer riêng
const userInfoInLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo'))
  : {};

//! tối ưu lại đoạn này, mỗi reducer nên có state riêng chứ ko viết chung
const INITIAL_STATE = {
  cart: {
    cartItems: cartItemsInLocalStorage,
    itemsCount: cartItemsInLocalStorage
      ? cartItemsInLocalStorage.reduce(
          (quantity, item) => Number(item.quantity) + quantity,
          0
        )
      : 0,
    cartSubtotal: cartItemsInLocalStorage
      ? cartItemsInLocalStorage.reduce(
          (price, item) => price + item.price * item.quantity,
          0
        )
      : 0,
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
