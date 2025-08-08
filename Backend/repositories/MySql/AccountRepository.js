const BaseRepository = require('../BaseRepository');
const bcrypt = require('bcryptjs');

class AccountRepository extends BaseRepository {
  constructor(context) { // Nhận dbPool qua constructor
    super(context);
    this.context = context; // Không cần dòng này nếu BaseRepository đã xử lý super(context)
  }

  /**
   * @override
   * Tạo một tài khoản mới trong database.
   * Mật khẩu sẽ được băm trước khi lưu.
   * @param {object} data - Dữ liệu tài khoản (userId, email, password).
   * @returns {Promise<object>} Tài khoản đã được tạo với ID.
   */
  async create(data) {
    const { userId, email, password } = data;
    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10); // 10 là salt rounds
    const query = `
      INSERT INTO accounts (userId, email, password)
      VALUES (?, ?, ?); -- Đã đổi từ $1, $2, $3 sang ?, ?, ? cho MySQL
    `;
    const values = [userId, email, hashedPassword]; // Sử dụng mật khẩu đã băm
    try {
      const [result] = await this.context.query(query, values); // mysql2 trả về [rows, fields]
      return { id: result.insertId, userId, email }; // MySQL trả về insertId
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
      throw new Error('Không thể tạo tài khoản. Email hoặc UserId có thể đã tồn tại.');
    }
  }

  /**
   * @override
   * Lấy tất cả tài khoản từ database (thường không cần trong thực tế vì lý do bảo mật).
   * @returns {Promise<Array<object>>} Mảng các tài khoản.
   */
  async readAll() {
    const query = 'SELECT id, userId, email FROM accounts'; // Đã bỏ dấu ngoặc kép cho userId
    try {
      const [rows] = await this.context.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi đọc tất cả tài khoản:', error);
      throw new Error('Không thể lấy danh sách tài khoản.');
    }
  }

  /**
   * @override
   * Lấy một tài khoản theo ID từ database.
   * @param {number} id - ID của tài khoản.
   * @returns {Promise<object | null>} Tài khoản tìm thấy hoặc null (không trả về mật khẩu).
   */
  async readById(id) {
    const query = 'SELECT id, userId, email FROM accounts WHERE id = ?'; // Đã đổi $1 sang ? và bỏ dấu ngoặc kép cho userId
    try {
      const [rows] = await this.context.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Lỗi khi đọc tài khoản với ID ${id}:`, error);
      throw new Error('Không thể lấy tài khoản.');
    }
  }

  /**
   * Lấy một tài khoản theo email (để đăng nhập).
   * @param {string} email - Email của tài khoản.
   * @returns {Promise<object | null>} Tài khoản tìm thấy (bao gồm mật khẩu hash) hoặc null.
   */
  async readByEmail(email) {
    const query = 'SELECT * FROM accounts WHERE email = ?'; // Đã đổi $1 sang ?
    try {
      const [rows] = await this.context.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Lỗi khi đọc tài khoản với email ${email}:`, error);
      throw new Error('Không thể lấy tài khoản theo email.');
    }
  }

  /**
   * @override
   * Cập nhật thông tin tài khoản trong database (chỉ email hoặc mật khẩu).
   * @param {number} id - ID của tài khoản cần cập nhật.
   * @param {object} data - Dữ liệu cập nhật (email, password).
   * @returns {Promise<boolean>} True nếu cập nhật thành công, False nếu không tìm thấy.
   */
  async update(id, data) {
    // Nếu có mật khẩu trong dữ liệu cập nhật, băm nó
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // Xây dựng câu truy vấn UPDATE động cho MySQL
    const fields = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const query = `
      UPDATE accounts
      SET ${fields}
      WHERE id = ?;
    `;
    try {
      const [result] = await this.context.query(query, [...values, id]);
      return result.affectedRows > 0; // MySQL trả về affectedRows
    } catch (error) {
      console.error(`Lỗi khi cập nhật tài khoản với ID ${id}:`, error);
      throw new Error('Không thể cập nhật tài khoản.');
    }
  }

  /**
   * @override
   * Xóa một tài khoản khỏi database.
   * @param {number} id - ID của tài khoản cần xóa.
   * @returns {Promise<boolean>} True nếu xóa thành công, False nếu không tìm thấy.
   */
  async delete(id) {
    const query = 'DELETE FROM accounts WHERE id = ?'; // Đã đổi $1 sang ?
    try {
      const [result] = await this.context.query(query, [id]);
      return result.affectedRows > 0; // MySQL trả về affectedRows
    } catch (error) {
      console.error(`Lỗi khi xóa tài khoản với ID ${id}:`, error);
      throw new Error('Không thể xóa tài khoản.');
    }
  }
}

module.exports = AccountRepository;