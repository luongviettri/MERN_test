import EditUserPageComponent from './components/EditUserPageComponent';
import axios from 'axios';
import { userService } from '../../services/userService';
import { trackPromise } from 'react-promise-tracker';

const fetchUser = async (userId) => {
  const { data } = await trackPromise(userService.fetchUserAdmin(userId));
  return data;
};

const updateUserApiRequest = async (userId, name, lastName, email, isAdmin) => {
  const { data } = await trackPromise(
    userService.updateUserAdmin(userId, name, lastName, email, isAdmin)
  );
  return data;
};

const AdminEditUserPage = () => {
  return (
    <EditUserPageComponent
      updateUserApiRequest={updateUserApiRequest}
      fetchUser={fetchUser}
    />
  );
};

export default AdminEditUserPage;
