class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Lấy tất cả người dùng.
   * GET /api/users
   */
  async getAllUsers(req, res) {
    try {
      const users = await this.userRepository.readAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // userController.js

  async getCurrentUser(req, res) {
    try {
      // Sửa lại cú pháp để lấy userId đúng cách
      const userId = req.user.userId;
      // Thêm 'await' để chờ kết quả từ cơ sở dữ liệu
      const user = await this.userRepository.readById(parseInt(userId));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Lấy người dùng theo ID.
   * GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userRepository.readById(parseInt(id));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Tạo người dùng mới.
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const { name, imageUrl } = req.body;
      const newUser = await this.userRepository.create({ name, imageUrl });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Cập nhật thông tin người dùng.
   * PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedUser = await this.userRepository.update(parseInt(id), updatedData);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Xóa người dùng.
   * DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const success = await this.userRepository.delete(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
