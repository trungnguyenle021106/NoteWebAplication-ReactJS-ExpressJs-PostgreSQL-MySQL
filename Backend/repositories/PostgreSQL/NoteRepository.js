const BaseRepository = require('../BaseRepository');

class NoteRepository extends BaseRepository {
    constructor(context) {
        super(context); // Rất quan trọng: truyền context lên lớp cha
    }

    async create(data) {
        const { title, content, userId, isCompleted = false, tags = null, dueDate = null, priority = null } = data;
        const query = `
      INSERT INTO notes (userId, title, content, isCompleted, tags, dueDate, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, "createdAt", "updatedAt"; -- Lấy ID và các trường thời gian tự động tạo
    `;
        const values = [userId, title, content, isCompleted, tags, dueDate, priority];
        try {
            const result = await this.context.query(query, values);
            // PostgreSQL trả về bản ghi đã tạo qua RETURNING
            return { ...result.rows[0], ...data };
        } catch (error) {
            console.error('Lỗi khi tạo ghi chú:', error);
            throw new Error('Không thể tạo ghi chú.');
        }
    }

    async readAll() {
        const query = 'SELECT * FROM notes';
        try {
            const result = await this.context.query(query);
            return result.rows;
        } catch (error) {
            console.error('Lỗi khi đọc tất cả ghi chú:', error);
            throw new Error('Không thể lấy danh sách ghi chú.');
        }
    }

    async readById(id) {
        const query = 'SELECT * FROM notes WHERE id = $1';
        try {
            const result = await this.context.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi đọc ghi chú với ID ${id}:`, error);
            throw new Error('Không thể lấy ghi chú.');
        }
    }

    async update(id, data) {
        // Xây dựng câu truy vấn UPDATE động
        const updates = Object.keys(data).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
        const values = Object.values(data);
        const query = `
      UPDATE notes
      SET ${updates}
      WHERE id = $${values.length + 1}
      RETURNING *; -- Lấy lại bản ghi đã cập nhật
    `;
        try {
            const result = await this.context.query(query, [...values, id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi cập nhật ghi chú với ID ${id}:`, error);
            throw new Error('Không thể cập nhật ghi chú.');
        }
    }

    async delete(id) {
        const query = 'DELETE FROM notes WHERE id = $1';
        try {
            const result = await this.context.query(query, [id]);
            return result.rowCount > 0; // rowCount cho biết số hàng bị ảnh hưởng
        } catch (error) {
            console.error(`Lỗi khi xóa ghi chú với ID ${id}:`, error);
            throw new Error('Không thể xóa ghi chú.');
        }
    }
}

// Quan trọng: Export Class, không phải instance
module.exports = NoteRepository;