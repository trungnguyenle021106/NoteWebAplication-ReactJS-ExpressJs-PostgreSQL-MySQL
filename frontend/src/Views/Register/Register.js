// src/components/Register.js
import React, { useState } from 'react';
import './Register.css';
import { register } from '../../Services/Auth/AuthService';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gửi dữ liệu đến API
    const result = await register(formData);

    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      // Chuyển hướng người dùng về trang đăng nhập
      navigate('/login');
    } else {
      // Hiển thị thông báo lỗi nếu có
      alert(result.message || 'Đăng ký thất bại.');
    }
  };
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản quản lý ghi chú</h2>
        <div className="form-group">
          <label htmlFor="name">Tên người dùng</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên của bạn"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">URL ảnh đại diện</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Nhập URL ảnh của bạn"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <button type="submit" className="register-btn">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
