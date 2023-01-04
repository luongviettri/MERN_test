import RegisterPageComponent from './components/RegisterPageComponent';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../redux/actions/userActions';
import { authenService } from '../services/authenService';
import catchAsync from '../utils/catchAsync';
const registerUserApiRequest = catchAsync(
  async (name, lastName, email, password) => {
    const { data } = await authenService.register(
      name,
      lastName,
      email,
      password
    );
    sessionStorage.setItem('userInfo', JSON.stringify(data.userCreated)); //! lưu lên session storage
    if (data.success === 'User created') window.location.href = '/user';
    return data;
  }
);

const RegisterPage = () => {
  const dispatch = useDispatch();

  return (
    <RegisterPageComponent
      registerUserApiRequest={registerUserApiRequest}
      dispatch={dispatch}
      loginAction={loginAction}
    />
  );
};

export default RegisterPage;
