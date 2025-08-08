// src/components/NoteList.js
import NoteItem from "../NoteItem/NoteItem";
import './NoteList.css';

function NoteList({ notes, handleDelete, handleEdit }) {
  // notes ở đây đã là danh sách đã được lọc và tìm kiếm từ App.js
  if (notes.length === 0) {
    return <div className="note-inform"><p>Không có ghi chú nào</p></div>;
  }

  return (
    <div className="notes">
      {notes.map((note) => (
        <NoteItem 
          key={note.id} 
          note={note} 
          handleDelete={handleDelete} 
          handleEdit={handleEdit} 
        />
      ))}
    </div>
  );
}
export default NoteList;
