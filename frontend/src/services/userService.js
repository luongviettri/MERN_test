import { baseService } from './baseService';
import { trackPromise } from 'react-promise-tracker';
class UserService extends baseService {
  constructor() {
    super();
  }
  //! start user
  getUser = (userID) => {
    return this.get('api/users/profile/' + userID);
  };

  updateUser = (
    name,
    lastName,
    phoneNumber,
    address,
    country,
    zipCode,
    city,
    state,
    password
  ) => {
    return this.put('api/users/profile', {
      name,
      lastName,
      phoneNumber,
      address,
      country,
      zipCode,
      city,
      state,
      password,
    });
  };

  fetchUser = (userID) => {
    return this.get('api/users/profile/' + userID);
  };
  //! end user

  //! start admin

  fetchUserAdmin = (userId) => {
    return this.get(`api/users/${userId}`);
  };

  updateUserAdmin = (userId, name, lastName, email, isAdmin) => {
    return this.put(`api/users/${userId}`, {
      name,
      lastName,
      email,
      isAdmin,
    });
  };

  fetchAllUsersAdmin = (abortController) => {
    return this.get('api/users', {
      signal: abortController.signal,
    });
  };

  deleteUser = (userId) => {
    return this.delete(`api/users/${userId}`);
  };

  // ! end admin
}
export const userService = new UserService();
