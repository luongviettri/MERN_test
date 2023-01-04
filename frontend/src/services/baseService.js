import axios from 'axios';
import { DOMAIN } from '../utils/config';

export class baseService {
  //put json về phía backend
  put = (url, model) => {
    return axios({
      url: `${DOMAIN}/${url}`,
      method: 'PUT',
      data: model,
      //   headers: {
      //     TokenCybersoft: TOKEN_CYBERSOFT,
      //   },
    });
  };

  patch = (url, model) => {
    return axios({
      url: `${DOMAIN}/${url}`,
      method: 'PATCH',
      data: model,
      //   headers: {
      //     TokenCybersoft: TOKEN_CYBERSOFT,
      //   },
    });
  };

  post = (url, model = '') => {
    return axios({
      url: `${DOMAIN}/${url}`,
      method: 'POST',
      data: model,
      //   headers: {
      //     Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      //     TokenCybersoft: TOKEN_CYBERSOFT,
      //   },
    });
  };

  get = (url) => {
    return axios({
      url: `${DOMAIN}/${url}`,
      method: 'GET',
      //   headers: {
      //     TokenCybersoft: TOKEN_CYBERSOFT,
      //   },
    });
  };

  delete = (url) => {
    return axios({
      url: `${DOMAIN}/${url}`,
      method: 'DELETE',
      //   headers: {
      //     Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      //     TokenCybersoft: TOKEN_CYBERSOFT,
      //   },
    });
  };
}
