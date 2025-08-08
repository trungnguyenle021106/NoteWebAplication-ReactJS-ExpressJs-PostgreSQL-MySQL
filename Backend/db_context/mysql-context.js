const mysql = require('mysql2/promise'); // Sử dụng phiên bản promise để dùng async/await

const mysqlContext = mysql.createPool({
  host: 'localhost',    // Địa chỉ host của MySQL server
  user: 'root',         // Tên người dùng database
  password: '0937210476A@a', // Mật khẩu database của bạn (thay thế bằng mật khẩu thật)
  database: 'notedb', // Tên database của bạn (đảm bảo đã tạo database này)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = mysqlContext;