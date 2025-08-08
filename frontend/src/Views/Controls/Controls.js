// src/components/Controls.js
import React from "react";
import './Controls.css';

function Controls({ 
  toggleFormVisibility, 
  searchQuery, 
  setSearchQuery, 
  filterStatus, 
  setFilterStatus,
  filterPriority,
  setFilterPriority
}) { 
  return (
    <div className="controls">
      {/* Gán hàm vào sự kiện onClick */}
      <button className="create-btn" onClick={toggleFormVisibility}>Tạo ghi chú</button>
      <input
        type="text"
        className="search-input"
        placeholder="Tìm kiếm ghi chú..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select 
        className="filter-select"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="Tất cả">Lọc theo trạng thái</option>
        <option value="Hoàn thành">Hoàn thành</option>
        <option value="Chưa hoàn thành">Chưa hoàn thành</option>
      </select>
      <select 
        className="filter-select"
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option value="Tất cả">Lọc theo ưu tiên</option>
        <option value="Cao">Cao</option>
        <option value="Trung bình">Trung bình</option>
        <option value="Thấp">Thấp</option>
      </select>
    </div>
  );
}

export default Controls;
