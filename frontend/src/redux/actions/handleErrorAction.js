import { SHOW_ERROR_ACTION } from '../constants/handleErrorConstant';

export function showErrorAction(errorMessage = '') {
  return {
    type: SHOW_ERROR_ACTION,
    payload: errorMessage,
  };
}
