const API_BASE_URL = 'http://localhost:3000/api';


export const getCurrentUser = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy thông tin người dùng hiện tại.');
    }

    const userData = await response.json();
    return { success: true, data: userData };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error);
    return { success: false, message: error.message };
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const formData = new FormData();
    formData.append('name', updateData.name);
    if (updateData.image) {
      formData.append('image', updateData.image);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT', // Đã thay đổi từ PATCH sang PUT
      body: formData,
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result.user };
    } else {
      return { success: false, message: result.message || 'Lỗi khi cập nhật thông tin người dùng.' };
    }
  } catch (error) {
    console.error('Lỗi khi gọi API updateUser:', error);
    return { success: false, message: 'Lỗi kết nối server.' };
  }
};