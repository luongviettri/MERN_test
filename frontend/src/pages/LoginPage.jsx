import LoginPageComponent from './components/LoginPageComponent';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../redux/actions/userActions';
import { authenService } from '../services/authenService';

const LoginPage = () => {
  const dispatch = useDispatch();

  return <LoginPageComponent dispatch={dispatch} loginAction={loginAction} />;
};

export default LoginPage;
