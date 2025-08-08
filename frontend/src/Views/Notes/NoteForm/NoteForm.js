// src/components/NoteForm.js
import React, { useState, useEffect } from "react";
import './NoteForm.css';

function NoteForm({ addNote, updateNote, editingNote, toggleFormVisibility }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    dueDate: "",
    priority: "Trung bình",
    isCompleted: false, // Thêm trạng thái hoàn thành
  });

  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title || "",
        content: editingNote.content || "",
        tags: Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : "",
        dueDate: editingNote.dueDate ? new Date(editingNote.dueDate).toISOString().split('T')[0] : "",
        priority: editingNote.priority || "Trung bình",
        isCompleted: editingNote.isCompleted || false, // Đổ dữ liệu trạng thái hoàn thành
      });
    } else {
      setFormData({
        title: "",
        content: "",
        tags: "",
        dueDate: "",
        priority: "Trung bình",
        isCompleted: false, // Reset trạng thái hoàn thành
      });
    }
  }, [editingNote]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noteData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      dueDate: formData.dueDate || null,
      priority: formData.priority,
      isCompleted: formData.isCompleted, 
    };

    if (editingNote) {
      await updateNote({ ...noteData, id: editingNote.id });
    } else {
      await addNote(noteData);
    }
    
    toggleFormVisibility();
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <button 
        type="button" 
        className="close-btn" 
        onClick={toggleFormVisibility}
      >
        &times;
      </button>
      <h3>{editingNote ? "Sửa Ghi chú" : "Thêm Ghi chú mới"}</h3>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Tiêu đề ghi chú"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Nội dung ghi chú"
        rows="4"
        required
      ></textarea>
      <input
        type="text"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="Thẻ (cách nhau bằng dấu phẩy)"
      />
      <div className="form-row">
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Thấp">Thấp</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Cao">Cao</option>
        </select>
      </div>
      
      {/* Thêm checkbox để cập nhật trạng thái hoàn thành */}
      {editingNote && (
        <div className="form-row form-checkbox">
          <input
            type="checkbox"
            id="isCompleted"
            name="isCompleted"
            checked={formData.isCompleted}
            onChange={handleChange}
          />
          <label htmlFor="isCompleted">Đánh dấu đã hoàn thành</label>
        </div>
      )}

      <button type="submit">{editingNote ? "Cập nhật ghi chú" : "Thêm ghi chú"}</button>
    </form>
  );
}

export default NoteForm;
