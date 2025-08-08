/**
 * @file controllers/account.controller.js
 * @description Controller xử lý các yêu cầu liên quan đến tài khoản (đăng ký, đăng nhập).
 * Đã tích hợp JWT để tạo token khi đăng nhập thành công.
 */

const bcrypt = require('bcryptjs'); // Nhập thư viện bcryptjs
const jwt = require('jsonwebtoken'); // Nhập thư viện jsonwebtoken

class AccountController {
  constructor(accountRepository, userRepository) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET; // Lấy secret key từ biến môi trường
    if (!this.jwtSecret) {
      console.error('Lỗi: JWT_SECRET không được định nghĩa trong biến môi trường!');
      process.exit(1);
    }
  }

  /**
   * Đăng ký tài khoản mới.
   * POST /api/register
   * Tạo một người dùng mới và một tài khoản liên kết.
   */
  async register(req, res) {
    try {
      const { name, imageUrl, email, password } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const existingAccount = await this.accountRepository.readByEmail(email);
      if (existingAccount) {
        return res.status(409).json({ message: 'Email đã được sử dụng.' }); // 409 Conflict
      }

      // 1. Tạo người dùng mới (profile)
      const newUser = await this.userRepository.create({ name, imageUrl });

      // 2. Tạo tài khoản liên kết với người dùng vừa tạo
      const newAccount = await this.accountRepository.create({
        userId: newUser.id,
        email,
        password // Mật khẩu sẽ được băm trong Repository
      });

      res.status(201).json({
        message: 'Đăng ký thành công!',
        user: newUser,
        account: { id: newAccount.id, email: newAccount.email } // Không trả về mật khẩu
      });
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Đăng nhập tài khoản.
   * POST /api/login
   * Tạo và trả về JWT nếu xác thực thành công.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const account = await this.accountRepository.readByEmail(email);

      if (!account) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      }

      // So sánh mật khẩu đã băm
      const isPasswordValid = await bcrypt.compare(password, account.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      }

      // Nếu đăng nhập thành công, tạo JWT token
      const token = jwt.sign(
        { id: account.id, userId: account.userId, email: account.email },
        this.jwtSecret,
        { expiresIn: '168h' } // Token hết hạn sau 1 giờ
      );

      // Đặt token vào HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true, // Cookie chỉ có thể được truy cập bởi server
        secure: false, // Chỉ gửi qua HTTPS trong môi trường production
        maxAge: 604800000, // Thời gian sống của cookie (1 giờ = 3600000 ms)
        sameSite: 'Lax' // Bảo vệ CSRF (Cross-Site Request Forgery)
      });

      const user = await this.userRepository.readById(account.userId);

      res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: user,
        // Không trả về token trong body nữa, vì nó đã nằm trong cookie
      });

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      res.status(500).json({ message: error.message });
    }
  }
  // Các phương thức CRUD cho account (giữ nguyên)
  async getAccountById(req, res) {
    try {
      const { id } = req.params;
      const account = await this.accountRepository.readById(parseInt(id));
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAccount(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedAccount = await this.accountRepository.update(parseInt(id), updatedData);
      if (updatedAccount) {
        res.json(updatedAccount);
      } else {
        res.status(404).json({ message: 'Không tìm thấy tài khoản để cập nhật.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const success = await this.accountRepository.delete(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AccountController;
