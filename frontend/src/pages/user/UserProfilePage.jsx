import UserProfilePageComponent from './components/UserProfilePageComponent';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../redux/actions/userActions';
import { userService } from '../../services/userService';
import { trackPromise } from 'react-promise-tracker';

const updateUserApiRequest = async (
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
  const { data } = await trackPromise(
    userService.updateUser(
      name,
      lastName,
      phoneNumber,
      address,
      country,
      zipCode,
      city,
      state,
      password
    )
  );
  return data;
};

const fetchUser = async (user_id) => {
  const { data } = await trackPromise(userService.fetchUser(user_id));
  return data;
};

const UserProfilePage = () => {
  const reduxDispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userRegisterLoginReducer);

  return (
    <UserProfilePageComponent
      updateUserApiRequest={updateUserApiRequest}
      fetchUser={fetchUser}
      userInfoFromRedux={userInfo}
      loginAction={loginAction}
      reduxDispatch={reduxDispatch}
      localStorage={window.localStorage}
      sessionStorage={window.sessionStorage}
    />
  );
};

export default UserProfilePage;
