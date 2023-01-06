import { CART } from '../../utils/config';
import * as actionTypes from '../constants/cartConstants';
import { toast } from 'react-toastify';

const cartItemsInLocalStorage = localStorage.getItem(CART)
  ? JSON.parse(localStorage.getItem(CART))
  : [];

const CART_INITIAL_STATE = {
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
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      //! phần này code cực kì tệ hại, cần optimize
      //! logic là nếu product đã có trong giỏ hàng thì đếm lại sản phẩm, và gán lại số lượng của product = số lượng mới ( nhưng số lượng tối đa là 3, ví dụ client mún chọn 10 sản phẩm thì sao ? )

      const productBeingAddedToCart = action.payload;
      //! gửi thông báo
      toast.success('Đã thêm sản phẩm vào giỏ hàng', {
        position: toast.POSITION.TOP_RIGHT,
      });

      const currentState = { ...state };

      //! lặp để tìm xem trong cartItems đã có product này ko? nếu có thì gán vào biến
      const productAlreadyExistsInState = state.cartItems.find(
        (x) => x.productID === productBeingAddedToCart.productID
      );
      //2: nếu đã có product đang được chọn

      if (productAlreadyExistsInState) {
        currentState.itemsCount = 0;
        currentState.cartSubtotal = 0;

        currentState.cartItems = state.cartItems.map((x) => {
          //todo: vào trong giỏ hàng: tìm productID = product có sẵn và tăng số lượng, tổng tiền
          if (x.productID === productAlreadyExistsInState.productID) {
            currentState.itemsCount += Number(productBeingAddedToCart.quantity);
            const sum =
              Number(productBeingAddedToCart.quantity) *
              Number(productBeingAddedToCart.price);
            currentState.cartSubtotal += sum;
            //todo: ko thì tìm đến số lượng và tăng lên, tìm đến tổng tiền và tăng lên
          } else {
            currentState.itemsCount += Number(x.quantity);
            const sum = Number(x.quantity) * Number(x.price);
            currentState.cartSubtotal += sum;
          }
          return x.productID === productAlreadyExistsInState.productID
            ? productBeingAddedToCart
            : x;
        });
      } else {
        //2: nếu chưa có product đang được chọn

        currentState.itemsCount += Number(productBeingAddedToCart.quantity);
        const sum =
          Number(productBeingAddedToCart.quantity) *
          Number(productBeingAddedToCart.price);
        currentState.cartSubtotal += sum;
        currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
      }

      return currentState;
    }
    case actionTypes.REMOVE_FROM_CART: {
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) => x.productID !== action.payload.productID
        ),
        itemsCount: state.itemsCount - action.payload.quantity,
        cartSubtotal:
          state.cartSubtotal - action.payload.price * action.payload.quantity,
      };
    }
    default:
      return state;
  }
};
