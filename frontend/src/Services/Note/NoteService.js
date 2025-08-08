// src/services/NoteService.js

/**
 * Lấy tất cả ghi chú của người dùng hiện tại.
 * @returns {Promise<object>} Trả về một đối tượng chứa mảng ghi chú hoặc thông báo lỗi.
 */
export const getAllNotes = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách ghi chú.');
    }

    const notes = await response.json();
    return { success: true, data: notes };
  } catch (error) {
    console.error('Lỗi khi lấy tất cả ghi chú:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Lấy một ghi chú theo ID.
 * @param {string} noteId - ID của ghi chú.
 * @returns {Promise<object>} Trả về một đối tượng chứa ghi chú hoặc thông báo lỗi.
 */
export const getNoteById = async (noteId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không tìm thấy ghi chú.');
    }

    const note = await response.json();
    return { success: true, data: note };
  } catch (error) {
    console.error('Lỗi khi lấy ghi chú theo ID:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Tạo một ghi chú mới.
 * @param {object} noteData - Dữ liệu của ghi chú mới (title, content, etc.).
 * @returns {Promise<object>} Trả về ghi chú đã được tạo hoặc thông báo lỗi.
 */
export const createNote = async (noteData) => {
  try {
    const response = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tạo ghi chú mới.');
    }

    const newNote = await response.json();
    return { success: true, data: newNote };
  } catch (error) {
    console.error('Lỗi khi tạo ghi chú:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Cập nhật một ghi chú hiện có.
 * @param {string} noteId - ID của ghi chú cần cập nhật.
 * @param {object} updatedData - Dữ liệu cập nhật.
 * @returns {Promise<object>} Trả về ghi chú đã được cập nhật hoặc thông báo lỗi.
 */
export const updateNote = async (noteId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể cập nhật ghi chú.');
    }

    const updatedNote = await response.json();
    return { success: true, data: updatedNote };
  } catch (error) {
    console.error('Lỗi khi cập nhật ghi chú:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa một ghi chú theo ID.
 * @param {string} noteId - ID của ghi chú cần xóa.
 * @returns {Promise<object>} Trả về trạng thái thành công hoặc thông báo lỗi.
 */
export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể xóa ghi chú.');
    }

    return { success: true, message: 'Ghi chú đã được xóa thành công.' };
  } catch (error) {
    console.error('Lỗi khi xóa ghi chú:', error);
    return { success: false, message: error.message };
  }
};
