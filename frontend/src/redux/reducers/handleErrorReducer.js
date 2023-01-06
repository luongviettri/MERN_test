import {
  SHOW_ERROR_ACTION,
  USER_EXISTS,
  WRONG_CREDENTIALS,
} from '../constants/handleErrorConstant';
import { toast } from 'react-toastify';

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_ERROR_ACTION:
      switch (payload) {
        case USER_EXISTS:
          toast.error('Tài khoản đã tồn tại');
          break;
        case WRONG_CREDENTIALS:
          toast.error('Sai thông tin đăng nhập');
          break;

        default:
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
          break;
      }
      return {
        ...state,
      };

    default:
      return state;
  }
};
