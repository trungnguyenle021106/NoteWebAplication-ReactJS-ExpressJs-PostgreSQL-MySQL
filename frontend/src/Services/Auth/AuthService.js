const API_BASE_URL = 'http://localhost:3000/api';


export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.status === 200;
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
    return false;
  }
};

// Hàm async để gọi API đăng ký
export const register = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (userData.image) {
      // Tên trường 'image' phải khớp với tên bạn đã cấu hình trong backend
      formData.append('image', userData.image);
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: formData, // Tự động thiết lập Content-Type: multipart/form-data
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, message: result.message || 'Lỗi đăng ký.' };
    }
  } catch (error) {
    console.error('Lỗi khi gọi API đăng ký:', error);
    return { success: false, message: 'Lỗi kết nối server.' };
  }
};

// Hàm async để gọi API đăng nhập
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    // Trả về JSON, bao gồm cả JWT được thiết lập qua cookie
    return response.json();
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập.' };
  }
};


// Thêm hàm async để gọi API đăng xuất
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include' để đảm bảo cookie được gửi cùng request
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || 'Đăng xuất thất bại.' };
    }
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    return { success: false, message: 'Lỗi kết nối server.' };
  }
};