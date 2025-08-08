const express = require('express');
const router = express.Router();

module.exports = function (noteController) {
  /**
   * @swagger
   * tags:
   *   - name: Notes
   *     description: API để quản lý ghi chú
   */

  /**
   * @swagger
   * /api/notes:
   *   get:
   *     summary: Lấy tất cả các ghi chú
   *     tags: 
   *       - Notes
   *     responses:
   *       200:
   *         description: Danh sách các ghi chú
   *       500:
   *         description: Lỗi máy chủ
   */
  router.get('/', noteController.getAllNotes.bind(noteController));

  /**
   * @swagger
   * /api/notes:
   *   post:
   *     summary: Tạo một ghi chú mới
   *     tags: 
   *       - Notes
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *     responses:
   *       201:
   *         description: Ghi chú đã được tạo thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   */
  router.post('/', noteController.createNote.bind(noteController));

  /**
   * @swagger
   * /api/notes/{id}:
   *   get:
   *     summary: Lấy một ghi chú theo ID
   *     tags: 
   *       - Notes
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của ghi chú
   *     responses:
   *       200:
   *         description: Trả về thông tin ghi chú
   *       404:
   *         description: Không tìm thấy ghi chú
   */
  router.get('/:id', noteController.getNoteById.bind(noteController));

  /**
   * @swagger
   * /api/notes/{id}:
   *   put:
   *     summary: Cập nhật một ghi chú theo ID
   *     tags: 
   *       - Notes
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của ghi chú cần cập nhật
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Ghi chú đã được cập nhật thành công
   *       404:
   *         description: Không tìm thấy ghi chú
   */
  router.put('/:id', noteController.updateNote.bind(noteController));

  /**
   * @swagger
   * /api/notes/{id}:
   *   delete:
   *     summary: Xóa một ghi chú theo ID
   *     tags: 
   *       - Notes
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của ghi chú cần xóa
   *     responses:
   *       200:
   *         description: Ghi chú đã được xóa thành công
   *       404:
   *         description: Không tìm thấy ghi chú
   */
  router.delete('/:id', noteController.deleteNote.bind(noteController));

  return router;
};