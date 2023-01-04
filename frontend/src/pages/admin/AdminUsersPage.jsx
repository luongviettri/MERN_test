import UsersPageComponent from './components/UsersPageComponent';
import axios from 'axios';
import { userService } from '../../services/userService';
import { trackPromise } from 'react-promise-tracker';

//! 2 hàm fetch và delete có thể tối ưu code lại
const fetchUsers = async (abctrl) => {
  const { data } = await trackPromise(userService.fetchAllUsersAdmin(abctrl));
  return data;
};

const deleteUser = async (userId) => {
  const { data } = await trackPromise(userService.deleteUser(userId));
  return data;
};

const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsers={fetchUsers} deleteUser={deleteUser} />;
};

export default AdminUsersPage;
