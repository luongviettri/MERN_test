import { baseService } from './baseService';

class AuthenService extends baseService {
  constructor() {
    super();
  }

  login = (email, password, doNotLogout) => {
    return this.post(`api/users/login`, {
      email,
      password,
      doNotLogout,
    });
  };

  register = (name, lastName, email, password) => {
    return this.post('api/users/register', {
      name,
      lastName,
      email,
      password,
    });
  };
}
export const authenService = new AuthenService();
