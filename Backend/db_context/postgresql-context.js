const postgresql = require('pg'); // Import Pool từ thư viện pg

const postgresqlContext = new postgresql.Pool({
    user: 'postgres',         // Tên người dùng PostgreSQL
    host: 'localhost',        // Địa chỉ host của PostgreSQL server
    database: 'NoteDB',       // Tên database
    password: '0937210476A@a',  // Mật khẩu database của bạn
    port: 5432,               // Cổng mặc định của PostgreSQL
    max: 10,                  // Số lượng kết nối tối đa
    idleTimeoutMillis: 30000, // Thời gian kết nối không hoạt động sẽ bị đóng (30 giây)
    connectionTimeoutMillis: 2000, // Thời gian chờ kết nối (2 giây)
});


module.exports = postgresqlContext;