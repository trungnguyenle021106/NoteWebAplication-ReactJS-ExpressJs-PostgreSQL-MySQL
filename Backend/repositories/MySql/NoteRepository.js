const BaseRepository = require('../BaseRepository');

class NoteRepository extends BaseRepository {
    constructor(context) {
        super(context); // Rất quan trọng: truyền context lên lớp cha
    }


    async create(data) {
        const { title, content, userId, isCompleted = false, tags = null, dueDate = null, priority = null } = data;
        const query = `
            INSERT INTO notes (userId, title, content, isCompleted, tags, dueDate, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await this.context.execute(query, [userId, title, content, isCompleted, tags, dueDate, priority]);
            return { id: result.insertId, ...data };
        } catch (error) {
            console.error('Lỗi khi tạo ghi chú:', error);
            throw new Error('Không thể tạo ghi chú.');
        }
    }

    async readAll() {
        const query = 'SELECT * FROM notes';
        try {
            const [rows] = await this.context.execute(query);
            return rows;
        } catch (error) {
            console.error('Lỗi khi đọc tất cả ghi chú:', error);
            throw new Error('Không thể lấy danh sách ghi chú.');
        }
    }

    async readById(id) {
        const query = 'SELECT * FROM notes WHERE id = ?';
        try {
            const [rows] = await this.context.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi đọc ghi chú với ID ${id}:`, error);
            throw new Error('Không thể lấy ghi chú.');
        }
    }

    async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE notes SET ${fields} WHERE id = ?`;
        try {
            const [result] = await this.context.execute(query, [...values, id]);
            if (result.affectedRows === 0) {
                return null;
            }
            return this.readById(id);
        } catch (error) {
            console.error(`Lỗi khi cập nhật ghi chú với ID ${id}:`, error);
            throw new Error('Không thể cập nhật ghi chú.');
        }
    }

    async delete(id) {
        const query = 'DELETE FROM notes WHERE id = ?';
        try {
            const [result] = await this.context.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Lỗi khi xóa ghi chú với ID ${id}:`, error);
            throw new Error('Không thể xóa ghi chú.');
        }
    }

    async readAllByUserId(userId) {
        // Đối với PostgreSQL: const query = 'SELECT * FROM notes WHERE "userId" = $1';
        // Đối với MySQL: const query = 'SELECT * FROM notes WHERE userId = ?';
        const query = 'SELECT * FROM notes WHERE userId = ?'; // Ví dụ cho MySQL
        try {
            // Đối với PostgreSQL: const result = await this.dbPool.query(query, [userId]); return result.rows;
            // Đối với MySQL: const [rows] = await this.dbPool.execute(query, [userId]); return rows;
            const [rows] = await this.context.execute(query, [userId]); // Ví dụ cho MySQL
            return rows;
        } catch (error) {
            console.error(`Lỗi khi đọc tất cả ghi chú của người dùng ${userId}:`, error);
            throw new Error('Không thể lấy danh sách ghi chú của người dùng.');
        }
    }

    /**
     * Lấy một ghi chú theo ID và đảm bảo nó thuộc về một người dùng cụ thể.
     * @param {number} id - ID của ghi chú.
     * @param {number} userId - ID của người dùng.
     * @returns {Promise<object | null>} Ghi chú tìm thấy hoặc null.
     */
    async readByIdAndUserId(id, userId) {
        // Đối với PostgreSQL: const query = 'SELECT * FROM notes WHERE id = $1 AND "userId" = $2';
        // Đối với MySQL: const query = 'SELECT * FROM notes WHERE id = ? AND userId = ?';
        const query = 'SELECT * FROM notes WHERE id = ? AND userId = ?'; // Ví dụ cho MySQL
        try {
            // Đối với PostgreSQL: const result = await this.dbPool.query(query, [id, userId]); return result.rows.length > 0 ? result.rows[0] : null;
            // Đối với MySQL: const [rows] = await this.dbPool.execute(query, [id, userId]); return rows.length > 0 ? rows[0] : null;
            const [rows] = await this.context.execute(query, [id, userId]); // Ví dụ cho MySQL
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi đọc ghi chú ${id} của người dùng ${userId}:`, error);
            throw new Error('Không thể lấy ghi chú của người dùng.');
        }
    }

}

// Quan trọng: Export Class, không phải instance
module.exports = NoteRepository;