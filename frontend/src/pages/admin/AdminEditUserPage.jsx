import EditUserPageComponent from './components/EditUserPageComponent';
import axios from 'axios';
import { userService } from '../../services/userService';

const fetchUser = async (userId) => {
  const { data } = await userService.fetchUserAdmin(userId);
  return data;
};

const updateUserApiRequest = async (userId, name, lastName, email, isAdmin) => {
  const { data } = await userService.updateUserAdmin(
    userId,
    name,
    lastName,
    email,
    isAdmin
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
