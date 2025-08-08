// src/components/Register.js
import React, { useState } from 'react';
import './Register.css';
import { register } from '../../Services/Auth/AuthService';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: null, // Sử dụng 'image' để khớp với backend
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await register(formData);

    if (result.success) {
      setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setFormData({ name: '', email: '', password: '', image: null });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessage(result.message || 'Đăng ký thất bại.');
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản quản lý ghi chú</h2>
        {message && <p className="message">{message}</p>}
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
          <label htmlFor="image">Ảnh đại diện</label>
          <input
            type="file"
            id="image"
            name="image" // Tên trường 'image' phải khớp với backend
            accept="image/*"
            onChange={handleChange}
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
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}

export default Register;
