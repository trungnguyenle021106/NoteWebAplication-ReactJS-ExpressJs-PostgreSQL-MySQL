import './Header.css';
import { getCurrentUser } from "../../Services/User/UserService";
import React, { useState, useEffect } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm state để xử lý trạng thái tải

  const handleEditProfile = () => {
    alert("Chức năng thay đổi thông tin đang được phát triển.");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    alert("Bạn đã đăng xuất.");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Sử dụng useEffect để gọi API bất đồng bộ
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData.success) {
          setUser(userData.data);
        } else {
          // Xử lý trường hợp không tìm thấy người dùng
          console.error(userData.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // [] đảm bảo hook chỉ chạy một lần khi component mount

  if (loading) {
    return <header className="app-header"><h1>Đang tải...</h1></header>;
  }

  // Nếu không có người dùng, hiển thị một trạng thái khác
  if (!user) {
    return <header className="app-header"><h1>Quản lý ghi chú</h1></header>;
  }

  return (
    <header className="app-header">
      <h1>Quản lý ghi chú</h1>
      {/* Container cho user info, sử dụng onMouseEnter và onMouseLeave để xử lý hover */}
      <div
        className="user-info-container"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="user-info">
          {/* Thay thế icon bằng ảnh đại diện */}
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="user-avatar"
          />
          <span className="user-name">{user.name}</span>
        </div>

        {/* Menu sẽ hiển thị khi isMenuOpen là true */}
        {isMenuOpen && (
          <div className="user-menu">
            <button onClick={handleEditProfile}>Thay đổi thông tin</button>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
