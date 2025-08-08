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