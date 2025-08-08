const BaseRepository = require('../BaseRepository');

class UserRepository extends BaseRepository {
    constructor(context) {
        super(context); // Rất quan trọng: truyền context lên lớp cha
    }

    async create(data) {
        const { name, imageUrl = null } = data;
        const query = `
      INSERT INTO users (name, imageUrl)
      VALUES (?, ?)
    `;
        try {
            const [result] = await this.context.execute(query, [name, imageUrl]);
            return { id: result.insertId, ...data };
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            throw new Error('Không thể tạo người dùng.');
        }
    }

    async readAll() {
        const query = 'SELECT * FROM users';
        try {
            const [rows] = await this.context.execute(query);
            return rows;
        } catch (error) {
            console.error('Lỗi khi đọc tất cả người dùng:', error);
            throw new Error('Không thể lấy danh sách người dùng.');
        }
    }

    async readById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        try {
            const [rows] = await this.context.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi đọc người dùng với ID ${id}:`, error);
            throw new Error('Không thể lấy người dùng.');
        }
    }

    async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE users SET ${fields} WHERE id = ?`;
        try {
            const [result] = await context.execute(query, [...values, id]);
            if (result.affectedRows === 0) {
                return null;
            }
            return this.readById(id);
        } catch (error) {
            console.error(`Lỗi khi cập nhật người dùng với ID ${id}:`, error);
            throw new Error('Không thể cập nhật người dùng.');
        }
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        try {
            const [result] = await this.context.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Lỗi khi xóa người dùng với ID ${id}:`, error);
            throw new Error('Không thể xóa người dùng.');
        }
    }
}

module.exports = UserRepository;
