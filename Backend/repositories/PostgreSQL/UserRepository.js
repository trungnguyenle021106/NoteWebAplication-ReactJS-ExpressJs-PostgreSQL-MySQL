const BaseRepository = require('../BaseRepository');
class UserRepository extends BaseRepository {
    constructor(context) {
        super(context); // Rất quan trọng: truyền context lên lớp cha
    }

    /**
     * @override
     * Tạo một người dùng mới trong database.
     * @param {object} data - Dữ liệu người dùng (name, imageUrl).
     * @returns {Promise<object>} Người dùng đã được tạo với ID.
     */
    async create(data) {
        const { name, imageUrl = null } = data;
        const query = `
      INSERT INTO users (name, imageUrl)
      VALUES ($1, $2)
      RETURNING id; -- Lấy ID mới tạo
    `;
        try {
            const result = await this.context.query(query, [name, imageUrl]);
            return { id: result.rows[0].id, ...data };
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            throw new Error('Không thể tạo người dùng.');
        }
    }

    /**
     * @override
     * Lấy tất cả người dùng từ database.
     * @returns {Promise<Array<object>>} Mảng các người dùng.
     */
    async readAll() {
        const query = 'SELECT * FROM users';
        try {
            const result = await this.context.query(query);
            return result.rows;
        } catch (error) {
            console.error('Lỗi khi đọc tất cả người dùng:', error);
            throw new Error('Không thể lấy danh sách người dùng.');
        }
    }

    /**
     * @override
     * Lấy một người dùng theo ID từ database.
     * @param {number} id - ID của người dùng.
     * @returns {Promise<object | null>} Người dùng tìm thấy hoặc null.
     */
    async readById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        try {
            const result = await this.context.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi đọc người dùng với ID ${id}:`, error);
            throw new Error('Không thể lấy người dùng.');
        }
    }

    /**
     * @override
     * Cập nhật thông tin người dùng trong database.
     * @param {number} id - ID của người dùng cần cập nhật.
     * @param {object} data - Dữ liệu cập nhật (name, imageUrl).
     * @returns {Promise<object | null>} Người dùng đã cập nhật hoặc null nếu không tìm thấy.
     */
    async update(id, data) {
        const updates = Object.keys(data).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
        const values = Object.values(data);
        const query = `
      UPDATE users
      SET ${updates}
      WHERE id = $${values.length + 1}
      RETURNING *; -- Lấy lại bản ghi đã cập nhật
    `;
        try {
            const result = await this.context.query(query, [...values, id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Lỗi khi cập nhật người dùng với ID ${id}:`, error);
            throw new Error('Không thể cập nhật người dùng.');
        }
    }

    /**
     * @override
     * Xóa một người dùng khỏi database.
     * @param {number} id - ID của người dùng cần xóa.
     * @returns {Promise<boolean>} True nếu xóa thành công, False nếu không tìm thấy.
     */
    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        try {
            const result = await this.context.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error(`Lỗi khi xóa người dùng với ID ${id}:`, error);
            throw new Error('Không thể xóa người dùng.');
        }
    }
}

module.exports = UserRepository;
