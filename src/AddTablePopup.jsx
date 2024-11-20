import React, { useState } from 'react';
import axios from 'axios';

const AddTablePopup = ({ onClose, onTableAdded }) => {
  const [tableId, setTableId] = useState('');
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    try {
      // Gọi API để thêm bàn với path variable
      await axios.get(`http://localhost:8080/table/create/${tableId}`); // Thay thế bằng URL API thực tế
      onTableAdded(); // Gọi hàm để tải lại danh sách bàn
      onClose(); // Đóng popup
    } catch (error) {
      console.error('Lỗi khi thêm bàn:', error); // In ra lỗi nếu có
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Thêm Bàn Mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Bàn số:</label>
            <input
              type="text"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Hủy</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm Bàn'} {/* Hiển thị trạng thái loading */}
            </button>
          </div>
        </form>
        {loading && <p className="text-center text-gray-500 mt-2">Đang xử lý...</p>} {/* Hiển thị thông báo loading */}
      </div>
    </div>
  );
};

export default AddTablePopup;