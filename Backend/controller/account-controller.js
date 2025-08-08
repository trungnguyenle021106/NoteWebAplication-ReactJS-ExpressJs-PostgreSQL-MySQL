/**
 * @file controllers/account.controller.js
 * @description Controller xử lý các yêu cầu liên quan đến tài khoản (đăng ký, đăng nhập).
 * Đã tích hợp JWT để tạo token khi đăng nhập thành công.
 */

const bcrypt = require('bcryptjs'); // Nhập thư viện bcryptjs
const jwt = require('jsonwebtoken'); // Nhập thư viện jsonwebtoken

class AccountController {
  constructor(accountRepository, userRepository, s3Repository) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
    this.s3Repository = s3Repository;
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
  // file: backend/controller/account-controller.js

  async register(req, res) {
    let newUser = null;
    let s3Key = null;

    try {
      const { name, email, password } = req.body;
      const uploadedFile = req.file;

      const existingAccount = await this.accountRepository.readByEmail(email);
      if (existingAccount) {
        return res.status(409).json({ message: 'Email đã được sử dụng.' });
      }

      // --- Bước 1: Tạo người dùng mới ---
      newUser = await this.userRepository.create({ name, imageUrl: '' });

      // --- Bước 2: Tải ảnh lên S3 nếu có file ---
      let s3ImageUrl = '';
      if (uploadedFile) {
        s3Key = `user_images/${newUser.id}-${uploadedFile.originalname}`;
        await this.s3Repository.uploadFile(s3Key, uploadedFile.buffer, uploadedFile.mimetype);

        // Cập nhật lại đường dẫn ảnh cho người dùng
        s3ImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        await this.userRepository.updateImageUrl(newUser.id, s3ImageUrl);
      }

      // --- Bước 3: Tạo tài khoản ---
      const newAccount = await this.accountRepository.create({
        userId: newUser.id,
        email,
        password,
      });

      // --- Bước 4: Hoàn thành và trả về phản hồi thành công ---
      res.status(201).json({
        message: 'Đăng ký thành công!',
        user: { ...newUser, imageUrl: s3ImageUrl },
        account: { id: newAccount.id, email: newAccount.email },
      });

    } catch (error) {
      console.error('Lỗi khi đăng ký, bắt đầu quá trình dọn dẹp:', error);

      // --- Các hành động bù trừ (Cleanup/Rollback) ---
      try {
        if (newUser && newUser.id) {
          await this.userRepository.delete(newUser.id);
          console.log(`Đã xóa user ID: ${newUser.id}`);
        }

        if (s3Key) {
          await this.s3Repository.deleteFile(s3Key);
          console.log(`Đã xóa file S3: ${s3Key}`);
        }
      } catch (cleanupError) {
        console.error('Lỗi trong quá trình dọn dẹp:', cleanupError);
      }
      res.status(500).json({ message: error.message || 'Lỗi server.' });
    }
  }

  /**
   * Đăng xuất tài khoản bằng cách xóa JWT cookie.
   * GET /api/logout
   */
  async logout(req, res) {
    try {
      // Xóa cookie có tên 'jwt'
      res.clearCookie('jwt');

      res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      res.status(500).json({ message: 'Không thể đăng xuất.' });
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
