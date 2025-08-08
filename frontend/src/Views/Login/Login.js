// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../../Services/Auth/AuthService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Đây là nơi bạn sẽ thực hiện logic đăng nhập thực tế
    // Ví dụ: gọi API, kiểm tra email/mật khẩu
    console.log('Email:', email);
    console.log('Mật khẩu:', password);

    const result = await login({email, password});
    
        if (result.success) {
          // Chuyển hướng người dùng về trang đăng nhập
          navigate('/');
        } else {
          // Hiển thị thông báo lỗi nếu có
          alert(result.message || 'Đăng nhập thất bại.');
        }
    // Sau khi đăng nhập thành công, có thể chuyển hướng người dùng về trang chính
    navigate('/');
  };

  const handleRegisterClick = () => {
    // Chuyển hướng người dùng đến trang đăng ký
    navigate('/register');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập ứng dụng ghi chú</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
            required
          />
        </div>
        <button type="submit" className="login-btn">Đăng nhập</button>
        <p className="register-link">
          Chưa có tài khoản? <span onClick={handleRegisterClick}>Đăng ký ngay</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
