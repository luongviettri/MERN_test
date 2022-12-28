import LoginPageComponent from './components/LoginPageComponent';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setReduxUserState } from '../redux/actions/userActions';

const loginUserApiRequest = async (email, password, doNotLogout) => {
  //! gọi data lấy dữ liệu
  const { data } = await axios.post('/api/users/login', {
    email,
    password,
    doNotLogout,
  });

  //! lưu dữ liệu lên localStorage
  //2: nếu client tick vào do not logout thì sẽ lưu ở local storage
  //2: ko tick thì sẽ lưu ở session storage vì khi tắt browser thì user data sẽ mất
  if (data.userLoggedIn.doNotLogout) {
    localStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
  } else sessionStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));

  return data;
};

const LoginPage = () => {
  const reduxDispatch = useDispatch();

  return (
    <LoginPageComponent
      loginUserApiRequest={loginUserApiRequest}
      reduxDispatch={reduxDispatch}
      setReduxUserState={setReduxUserState}
    />
  );
};

export default LoginPage;
