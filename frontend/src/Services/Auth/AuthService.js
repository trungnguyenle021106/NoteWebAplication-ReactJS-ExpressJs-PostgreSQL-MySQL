export const checkAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-status', {
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
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi đăng ký.' };
  }
};

// Hàm async để gọi API đăng nhập
export const login = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
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