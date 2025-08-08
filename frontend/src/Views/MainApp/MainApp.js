// src/App.js
import React, { useState, useEffect } from "react";
import "./MainApp.css";
import Header from "../Header/Header";
import Controls from "../Controls/Controls";
import NoteList from "../Notes/NoteList/NoteList";
import NoteForm from "../Notes/NoteForm/NoteForm";
import { getAllNotes, createNote, deleteNote, updateNote } from "../../Services/Note/NoteService";
import { getCurrentUser } from "../../Services/User/UserService"; // Import hàm này
import UserProfileForm from "../UserProfile/UserProfileForm";

function MainApp() {
  const [notes, setNotes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const [user, setUser] = useState(null);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterPriority, setFilterPriority] = useState("Tất cả");

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Lấy thông tin người dùng
      const userResult = await getCurrentUser();
      if (userResult.success) {
        setUser(userResult.data);
      } else {
        // Xử lý khi không có người dùng, ví dụ: chuyển hướng đến trang đăng nhập
        console.error("Không tìm thấy người dùng:", userResult.message);
      }

      // Lấy danh sách ghi chú
      const notesResult = await getAllNotes();
      if (notesResult.success) {
        const sanitizedNotes = notesResult.data.map(note => ({
          ...note,
          tags: Array.isArray(note.tags) ? note.tags : (note.tags ? note.tags.split(',').map(tag => tag.trim()) : [])
        }));
        setNotes(sanitizedNotes);
      } else {
        console.error("Lỗi khi lấy ghi chú:", notesResult.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);


  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(note.tags) && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = filterStatus === "Tất cả" ||
      (filterStatus === "Hoàn thành" && note.isCompleted) ||
      (filterStatus === "Chưa hoàn thành" && !note.isCompleted);

    const matchesPriority = filterPriority === "Tất cả" || note.priority.toLowerCase() === filterPriority.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });


  const handleDelete = async (id) => {
    const result = await deleteNote(id);
    if (result.success) {
      setNotes(notes.filter((note) => note.id !== id));
    } else {
      console.error("Lỗi khi xóa ghi chú:", result.message);
    }
  };

  const addNote = async (newNote) => {
    const result = await createNote(newNote);
    if (result.success) {
      const createdNote = {
        ...result.data,
        tags: Array.isArray(result.data.tags) ? result.data.tags : (result.data.tags ? result.data.tags.split(',').map(tag => tag.trim()) : [])
      };
      setNotes([createdNote, ...notes]);
      setIsFormVisible(false);
    } else {
      console.error("Lỗi khi thêm ghi chú:", result.message);
    }
  };

  const handleUpdate = async (updatedNote) => {
    const result = await updateNote(updatedNote.id, updatedNote);
    if (result.success) {
      // Sửa lỗi: Đảm bảo tags của ghi chú cập nhật là một mảng
      const updatedData = {
        ...result.data,
        tags: Array.isArray(result.data.tags) ? result.data.tags : (result.data.tags ? result.data.tags.split(',').map(tag => tag.trim()) : [])
      };
      setNotes(notes.map(note => note.id === updatedData.id ? updatedData : note));
      setEditingNote(null); // Đóng form chỉnh sửa
    } else {
      console.error("Lỗi khi cập nhật ghi chú:", result.message);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setIsFormVisible(true); // Mở form khi chỉnh sửa
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleOpenProfileForm = () => {
    setIsProfileFormVisible(true);
  };

  const handleCloseProfileForm = () => {
    setIsProfileFormVisible(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    setEditingNote(null); // Reset ghi chú đang chỉnh sửa khi đóng form
  };

  if (loading) {
    return <div className="app"><p>Đang tải dữ liệu...</p></div>;
  }

  // Khai báo cho cách 1 của Conditional Rendering 
  // let noteFormComponent;
  // if (isFormVisible) {
  //   noteFormComponent = <NoteForm addNote={addNote} toggleFormVisibility={toggleFormVisibility} />;
  // } else {
  //   noteFormComponent = null; // Hoặc để trống
  // }

  return (
    <div className="app">
      <Header onEditProfile={handleOpenProfileForm} />
      {isProfileFormVisible && user && (
        <div className="overlay">
          <UserProfileForm
            user={user}
            onUpdate={handleUpdateUser}
            onClose={handleCloseProfileForm}
          />
        </div>
      )}
      <Controls
        toggleFormVisibility={toggleFormVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {/* Conditional Rendering trong React dùng để thiết lập điều kiện, có 3 cách dùng sau  */}
      {/* 1 {noteFormComponent} */}
      {/* 2 {isFormVisible && <NoteForm addNote={addNote} toggleFormVisibility={toggleFormVisibility} />} */}
      { /*3*/ isFormVisible &&
        <div className="overlay">
          <NoteForm
            addNote={addNote}
            editingNote={editingNote}
            setEditingNote={setEditingNote}
            updateNote={handleUpdate}
            toggleFormVisibility={toggleFormVisibility}
          />
        </div>
      }
      <NoteList notes={filteredNotes} handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
}

export default MainApp;
