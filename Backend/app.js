
require('dotenv').config(); // Phải là dòng đầu tiên
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// === Thêm các thư viện Swagger ===
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Nhập middleware cors
// Middleware để đọc JSON từ request body
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:3000'], // Thay thế bằng địa chỉ frontend của bạn (ví dụ: Angular app)
  credentials: true, // Cho phép gửi cookie (quan trọng khi dùng JWT trong cookie)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
};
app.use(cors(corsOptions));

// === Cấu hình chọn Database ===
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mysql';

console.log(`Ứng dụng đang sử dụng database: ${DATABASE_TYPE.toUpperCase()}`);

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === Khai báo các biến ===
let dbContext;
let NoteRepository;
let AccountRepository;
let UserRepository;

// === Conditional Import và Khởi tạo ===
if (DATABASE_TYPE === 'mysql') {
  dbContext = require('./db_context/mysql-context');
  NoteRepository = require('./repositories/MySql/NoteRepository');
  AccountRepository = require('./repositories/MySql/AccountRepository');
  UserRepository = require('./repositories/MySql/UserRepository');
} else if (DATABASE_TYPE === 'postgresql') {
  dbContext = require('./db_context/postgresql-context');
  NoteRepository = require('./repositories/PostgreSQL/NoteRepository');
  AccountRepository = require('./repositories/PostgreSQL/AccountRepository');
  UserRepository = require('./repositories/PostgreSQL/UserRepository');
} else {
  console.error('Lỗi: DATABASE_TYPE không hợp lệ. Vui lòng đặt là "mysql" hoặc "postgresql".');
  process.exit(1);
}
const s3Context = require('./aws_context/s3-context');
const S3Repository = require('./repositories/AWS/S3/S3Repository');
const authMiddleware = require('./middlewarer/auth');

// === Nhập các Controller và Route ===
const NoteController = require('./controller/note-controller');
const AccountController = require('./controller/account-controller');
const UserController = require('./controller/user-controller');

const noteRoutes = require('./routes/noteRoutes');
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');

// === Tiêm phụ thuộc và cấu hình các Controller ===
const noteRepository = new NoteRepository(dbContext);
const userRepository = new UserRepository(dbContext);
const accountRepository = new AccountRepository(dbContext);
const s3Repository = new S3Repository(s3Context, process.env.AWS_BUCKET_NAME);

const noteController = new NoteController(noteRepository);
const userController = new UserController(userRepository);
const accountController = new AccountController(accountRepository, userRepository, s3Repository);

app.post('/api/check-status', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bạn đã đăng nhập.'
  });
});

// === Gán các Route vào ứng dụng Express ===
app.post('/api/register', upload.single('image'), accountController.register.bind(accountController));
app.post('/api/login', accountController.login.bind(accountController));

// Các route cần xác thực JWT
// Tất cả các route bên dưới authMiddleware sẽ yêu cầu token hợp lệ
app.use('/api/notes', authMiddleware, noteRoutes(noteController));
app.use('/api/users', authMiddleware, userRoutes(userController));

app.use('/api/accounts', accountRoutes(accountController));


// --- CẤU HÌNH SWAGGER ---
// Định nghĩa các tùy chọn cho swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quản lý ghi chú (Express.js)',
      version: '1.0.0',
      description: 'Một ứng dụng API ghi chú đơn giản được xây dựng với Express và hỗ trợ nhiều database.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Máy chủ phát triển',
      },
    ],
  },
  // Đường dẫn đến các file chứa JSDoc để swagger-jsdoc đọc
  // Bạn có thể chỉ định các file route hoặc controller ở đây
  apis: ['./routes/*.js'], // Đường dẫn đến các file route
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Tạo một route để hiển thị giao diện Swagger UI tại đường dẫn /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Xử lý lỗi chung (đặt cuối cùng)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Có lỗi xảy ra trên máy chủ!');
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên http://localhost:${PORT}`);
  console.log(`Tài liệu Swagger có sẵn tại http://localhost:${PORT}/api-docs`);
});