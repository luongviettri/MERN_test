import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { adminChatReducer } from './reducers/adminChatReducers';
import { cartReducer } from './reducers/cartReducers';
import { getCategoriesReducer } from './reducers/categoryReducers';
import handleErrorReducer from './reducers/handleErrorReducer';
import { userRegisterLoginReducer } from './reducers/userReducers';

const rootReducer = combineReducers({
  cartReducer,
  userRegisterLoginReducer,
  getCategoriesReducer,
  adminChatReducer,
  handleErrorReducer,
});

const middleware = [thunk];
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
