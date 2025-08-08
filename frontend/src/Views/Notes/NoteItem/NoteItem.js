// src/components/NoteItem.js
import React from "react";
import './NoteItem.css';

function NoteItem({ note, handleDelete, handleEdit }) {
  // Lấy createdAt từ object note và định dạng lại
  const formattedDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('vi-VN') : 'N/A';
  // Lấy dueDate từ object note
  const formattedDueDate = note.dueDate ? new Date(note.dueDate).toLocaleDateString('vi-VN') : 'Chưa có';

  return (
    <div className="note" key={note.id}>
      <div className="note-header">
        <h2 className="note-title">{note.title}</h2>
        <span className={`note-priority priority-${note.priority.toLowerCase()}`}>
          {note.priority}
        </span>
      </div>
      <p className="note-content">{note.content}</p>

      <div className="note-info">
        <p><strong>Ngày tạo:</strong> {formattedDate}</p>
        <p><strong>Ngày hết hạn:</strong> {formattedDueDate}</p>

        <div className="note-tags">
          <strong>Tags:</strong>
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="note-status">
        <span className={`status-label ${note.isCompleted ? 'completed' : 'incomplete'}`}>
          {note.isCompleted ? '✔️ Hoàn thành' : '⏳ Chưa hoàn thành'}
        </span>
      </div>

      <div className="note-actions">
        <button className="edit-btn" onClick={() => handleEdit(note)}>Cập nhật</button>
        <button
          className="delete-btn"
          onClick={() => handleDelete(note.id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
