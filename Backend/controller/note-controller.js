/**
 * @file controllers/note.controller.js
 * @description Controller xử lý các yêu cầu liên quan đến ghi chú.
 * Đã cập nhật để sử dụng userId từ req.user sau khi xác thực.
 */

class NoteController {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  /**
   * Lấy tất cả ghi chú.
   * GET /api/notes
   */
  async getAllNotes(req, res) {
    try {
      // Lấy ghi chú của người dùng hiện tại
      const userId = req.user.userId; // Lấy userId từ token đã giải mã
      const notes = await this.noteRepository.readAllByUserId(userId); // Cần thêm phương thức này vào Repository
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Lấy ghi chú theo ID.
   * GET /api/notes/:id
   */
  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId; // Lấy userId từ token đã giải mã
      const note = await this.noteRepository.readByIdAndUserId(parseInt(id), userId); // Cần thêm phương thức này
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ message: 'Không tìm thấy ghi chú hoặc bạn không có quyền truy cập.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Tạo ghi chú mới.
   * POST /api/notes
   */
  async createNote(req, res) {
    try {
      const userId = req.user.userId; // Lấy userId từ token đã giải mã
      const { title, content, isCompleted, tags, dueDate, priority } = req.body;
      const newNote = await this.noteRepository.create({
        title, content, userId, isCompleted, tags, dueDate, priority
      });
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Cập nhật ghi chú.
   * PUT /api/notes/:id
   */
  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId; // Lấy userId từ token đã giải mã
      const updatedData = req.body;

      // Kiểm tra xem ghi chú có thuộc về người dùng này không trước khi cập nhật
      const existingNote = await this.noteRepository.readByIdAndUserId(parseInt(id), userId);
      if (!existingNote) {
        return res.status(404).json({ message: 'Không tìm thấy ghi chú hoặc bạn không có quyền cập nhật.' });
      }

      const updatedNote = await this.noteRepository.update(parseInt(id), updatedData);
      if (updatedNote) {
        res.json(updatedNote);
      } else {
        res.status(404).json({ message: 'Không tìm thấy ghi chú để cập nhật.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Xóa ghi chú.
   * DELETE /api/notes/:id
   */
  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId; // Lấy userId từ token đã giải mã

      // Kiểm tra xem ghi chú có thuộc về người dùng này không trước khi xóa
      const existingNote = await this.noteRepository.readByIdAndUserId(parseInt(id), userId);
      if (!existingNote) {
        return res.status(404).json({ message: 'Không tìm thấy ghi chú hoặc bạn không có quyền xóa.' });
      }

      const success = await this.noteRepository.delete(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Không tìm thấy ghi chú để xóa.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = NoteController;
  