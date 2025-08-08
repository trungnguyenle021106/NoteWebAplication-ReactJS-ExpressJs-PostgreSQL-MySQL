// src/components/Header.js
import './Header.css';
import { getCurrentUser } from "../../Services/User/UserService";
import { logout } from '../../Services/Auth/AuthService';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Header({ onEditProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    onEditProfile(); // Gọi hàm từ App.js để mở form
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      alert(result.message || "Đăng xuất thất bại.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData.success) {
          setUser(userData.data);
        } else {
          console.error(userData.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <header className="app-header"><h1>Đang tải...</h1></header>;
  }

  if (!user) {
    return <header className="app-header"><h1>Quản lý ghi chú</h1></header>;
  }

  return (
    <header className="app-header">
      <h1>Quản lý ghi chú</h1>
      <div
        className="user-info-container"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="user-info">
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="user-avatar"
          />
          <span className="user-name">{user.name}</span>
        </div>

        {isMenuOpen && (
          <div className="user-menu">
            <button onClick={handleEditProfileClick}>Thay đổi thông tin</button>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
