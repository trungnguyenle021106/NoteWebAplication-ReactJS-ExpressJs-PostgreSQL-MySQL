const express = require('express');
const router = express.Router();

module.exports = function (accountController) {
  /**
   * @swagger
   * tags:
   *   - name: Accounts
   *     description: API để quản lý tài khoản người dùng
   */

  /**
   * @swagger
   * /api/accounts/register:
   *   post:
   *     summary: Đăng ký một tài khoản mới
   *     tags: 
   *       - Accounts
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               imageUrl:
   *                 type : string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Tài khoản đã được đăng ký thành công
   *       400:
   *         description: Lỗi từ phía người dùng, ví dụ như thiếu thông tin
   */
  router.post('/register', accountController.register.bind(accountController));

  /**
   * @swagger
   * /api/accounts/login:
   *   post:
   *     summary: Đăng nhập vào tài khoản
   *     tags: 
   *       - Accounts
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Đăng nhập thành công, trả về token
   *       401:
   *         description: Sai thông tin đăng nhập
   */
  router.post('/login', accountController.login.bind(accountController));

  /**
   * @swagger
   * /api/accounts/{id}:
   *   get:
   *     summary: Lấy thông tin tài khoản theo ID
   *     tags: 
   *       - Accounts
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của tài khoản
   *     responses:
   *       200:
   *         description: Trả về thông tin tài khoản
   *       404:
   *         description: Không tìm thấy tài khoản
   */
  router.get('/:id', accountController.getAccountById.bind(accountController));

  /**
   * @swagger
   * /api/accounts/{id}:
   *   put:
   *     summary: Cập nhật thông tin tài khoản
   *     tags: 
   *       - Accounts
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của tài khoản cần cập nhật
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
   *         description: Tài khoản đã được cập nhật thành công
   *       404:
   *         description: Không tìm thấy tài khoản
   */
  router.put('/:id', accountController.updateAccount.bind(accountController));

  /**
   * @swagger
   * /api/accounts/{id}:
   *   delete:
   *     summary: Xóa một tài khoản
   *     tags: 
   *       - Accounts
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của tài khoản cần xóa
   *     responses:
   *       200:
   *         description: Tài khoản đã được xóa thành công
   *       404:
   *         description: Không tìm thấy tài khoản
   */
  router.delete('/:id', accountController.deleteAccount.bind(accountController));

  return router;
};