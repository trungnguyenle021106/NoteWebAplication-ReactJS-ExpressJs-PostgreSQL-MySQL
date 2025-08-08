import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthStatus } from '../../Services/Auth/AuthService';

const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);


  useEffect(() => {
    // Đổi tên hàm thành 'fetchAuthStatus' để tránh trùng lặp
    const fetchAuthStatus = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuth(authStatus);
      setLoading(false);
    };
    fetchAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        Đang kiểm tra trạng thái đăng nhập...
      </div>
    );
  }

  // Nếu đã xác thực, hiển thị component con, nếu không thì chuyển hướng
  return isAuth ? children : <Navigate to="/login" />;
};

export default AuthRoute;