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
      // Thay thế alert bằng một modal tùy chỉnh để trải nghiệm tốt hơn
      console.error(result.message || "Đăng xuất thất bại.");
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

  // Tạo một thành phần logo để sử dụng lại
  const logoComponent = (
    // Bạn hãy thay thế URL hình ảnh dưới đây bằng URL logo thực tế của bạn
    <img
      src="/noteLogo.png"
      alt="Logo Web"
      className="web-logo"
    />
  );

  if (loading) {
    // Hiển thị logo khi đang tải
    return <header className="app-header loading-header">{logoComponent}</header>;
  }

  if (!user) {
    // Hiển thị logo khi chưa có người dùng đăng nhập
    return <header className="app-header">{logoComponent}</header>;
  }

  return (

    <header className="app-header">
      {/* Hiển thị logo ở đây thay vì tiêu đề h1 */}
      {logoComponent}
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
