const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (userController) {
  /**
   * @swagger
   * tags:
   *   - name: Users
   *     description: API để quản lý người dùng
   */

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Lấy tất cả người dùng
   *     tags: 
   *       - Users
   *     responses:
   *       200:
   *         description: Danh sách người dùng
   *       500:
   *         description: Lỗi máy chủ
   */
  router.get('/', userController.getAllUsers.bind(userController));

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Lấy thông tin người dùng theo ID
   *     tags: 
   *       - Users
   *     responses:
   *       200:
   *         description: Trả về thông tin người dùng
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.get('/me', userController.getCurrentUser.bind(userController));


  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Lấy thông tin người dùng theo ID
   *     tags: 
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của người dùng
   *     responses:
   *       200:
   *         description: Trả về thông tin người dùng
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.get('/:id', userController.getUserById.bind(userController));

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Tạo một người dùng mới
   *     tags: 
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       201:
   *         description: Người dùng đã được tạo thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   */
  router.post('/', userController.createUser.bind(userController));

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Cập nhật thông tin người dùng
   *     tags: 
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của người dùng cần cập nhật
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Người dùng đã được cập nhật thành công
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.put('/:id', upload.single('image'), userController.updateUser.bind(userController));

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Xóa một người dùng
   *     tags: 
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của người dùng cần xóa
   *     responses:
   *       200:
   *         description: Người dùng đã được xóa thành công
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.delete('/:id', userController.deleteUser.bind(userController));

  return router;
};