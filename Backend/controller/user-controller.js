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
    let oldImageUrl = null;
    let newS3Key = null;

    try {
        const { id } = req.params;
        const updatedData = req.body;
        const uploadedFile = req.file;

        // --- Bước 1: Lấy thông tin người dùng hiện tại ---
        const currentUser = await this.userRepository.readById(parseInt(id));
        if (!currentUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        oldImageUrl = currentUser.imageUrl;

        // --- Bước 2: Xử lý file ảnh mới (nếu có) ---
        if (uploadedFile) {
            newS3Key = `user_images/${currentUser.id}-${uploadedFile.originalname}`;

            // Tải ảnh mới lên S3
            await this.s3Repository.uploadFile(newS3Key, uploadedFile.buffer, uploadedFile.mimetype);

            // Cập nhật đường dẫn ảnh mới vào dữ liệu
            // Thay đổi ở đây để sử dụng bucket name và region từ .env
            updatedData.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newS3Key}`;

            // Xóa ảnh cũ trên S3 nếu tồn tại
            if (oldImageUrl) {
                // Lấy tên key từ URL cũ
                // Ví dụ: electric-store.s3.ap-southeast-2.amazonaws.com/user_images/key-file.png
                // Ta cần trích xuất 'user_images/key-file.png'
                const urlParts = oldImageUrl.split('/');
                const oldS3Key = `${urlParts[3]}/${urlParts[4]}`; // Lấy 'user_images/key-file.png'
                
                await this.s3Repository.deleteFile(oldS3Key);
            }
        }

        // --- Bước 3: Cập nhật người dùng vào database ---
        const updatedUser = await this.userRepository.update(parseInt(id), updatedData);

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
        }

    } catch (error) {
        // --- Rollback: Nếu có lỗi trong quá trình xử lý S3/DB ---
        console.error('Lỗi khi cập nhật người dùng, bắt đầu dọn dẹp:', error);
        try {
            // Nếu ảnh mới đã được tải lên nhưng cập nhật DB thất bại, xóa ảnh mới
            if (newS3Key) {
                await this.s3Repository.deleteFile(newS3Key);
                console.log(`Đã xóa file S3 mới: ${newS3Key}`);
            }
        } catch (cleanupError) {
            console.error('Lỗi trong quá trình dọn dẹp:', cleanupError);
        }
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
