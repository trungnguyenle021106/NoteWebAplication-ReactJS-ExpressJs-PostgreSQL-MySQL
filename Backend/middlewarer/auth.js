/**
 * @file middlewares/auth.middleware.js
 * @description Middleware để xác thực JWT token từ HTTP-only cookie hoặc header Authorization.
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token;

  // 1. Ưu tiên lấy token từ HTTP-only cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    // 2. Nếu không có trong cookie, thử lấy từ header Authorization (dự phòng)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có token xác thực.' });
  }

  try {
    // Xác minh token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin người dùng từ token vào đối tượng request
    req.user = decodedToken;
    next(); // Chuyển sang middleware/route handler tiếp theo
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn.' });
    }
    return res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};
