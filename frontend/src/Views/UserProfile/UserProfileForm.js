// src/components/UserProfileForm.js
import React, { useState } from 'react';
import { updateUser } from '../../Services/User/UserService';
import './UserProfileForm.css';

function UserProfileForm({ user, onUpdate, onClose }) {
  const [formData, setFormData] = useState({
    name: user.name,
    image: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user.imageUrl);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      // Tạo URL đối tượng để xem trước ảnh
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Tạo object chỉ chứa dữ liệu đã thay đổi
    const updateData = { name: formData.name };
    if (formData.image) {
      updateData.image = formData.image;
    }

    const result = await updateUser(user.id, updateData);

    if (result.success) {
      setMessage('Cập nhật thành công!');
      onUpdate(result.data); // Gọi hàm onUpdate để cập nhật UI trong App.js
      setTimeout(() => {
        onClose(); // Đóng form sau khi cập nhật thành công
      }, 1500);
    } else {
      setMessage(result.message || 'Cập nhật thất bại.');
    }
    setLoading(false);
  };

  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h3>Cập nhật hồ sơ</h3>
        {message && <p className="message">{message}</p>}
        
        <div className="avatar-preview-container">
            {previewImage && (
                <img src={previewImage} alt="Ảnh đại diện" className="current-avatar large-avatar" />
            )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên người dùng</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Chọn ảnh mới</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfileForm;
