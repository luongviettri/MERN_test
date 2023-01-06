import { showErrorAction } from '../redux/actions/handleErrorAction';
import store from '../redux/store';

// eslint-disable-next-line import/no-anonymous-default-export
export default (fn) => {
  return (...params) => {
    fn(...params).catch((error) => {
      console.log(Error(error.response.data.message ?? error.response.data));
      //! dispatch để gọi toastify
      store.dispatch(
        showErrorAction(error.response.data.message ?? error.response.data)
      );
    });
  };
};
