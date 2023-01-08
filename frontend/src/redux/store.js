import { createStore, combineReducers, applyMiddleware } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { adminChatReducer } from './reducers/adminChatReducers';
import { cartReducer } from './reducers/cartReducers';
import { getCategoriesReducer } from './reducers/categoryReducers';
import handleErrorReducer from './reducers/handleErrorReducer';
import { userRegisterLoginReducer } from './reducers/userReducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['userRegisterLoginReducer']
};

const rootReducer = combineReducers({
  cartReducer,
  userRegisterLoginReducer,
  getCategoriesReducer,
  adminChatReducer,
  handleErrorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default store;
