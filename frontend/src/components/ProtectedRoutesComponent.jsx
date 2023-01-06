import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import UserChatComponent from './user/UserChatComponent';
import axios from 'axios';
import LoginPage from '../pages/LoginPage';

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
    //! gọi API mỗi lần chuyển trang ?????????????????????????????????? tối ưu lại = lấy thông tin từ localStorage
    console.log('vô đây liên tục');
    axios.get('/api/get-token').then(function (data) {
      if (data.data.token) {
        setIsAuth(data.data.token);
      }
      return isAuth;
    });
  }, [isAuth]);

  if (isAuth === undefined) {
    return <LoginPage />;
  }

  return isAuth && admin && isAuth !== 'admin' ? (
    <Navigate to="/login" />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutesComponent;
