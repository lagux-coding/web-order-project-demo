import React, { useState } from 'react';
import axios from 'axios';

const TableStatusPopup = ({ table, onClose, onStatusChanged }) => {
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  const handleStatusChange = async (newStatus) => {
    setLoading(true); // Bắt đầu loading
    try {
      await axios.put(`https://web-order.onrender.com/table/update-status/${table.tableId}`, { status: newStatus }); // Gọi API để cập nhật trạng thái
      onStatusChanged(); // Gọi hàm để tải lại danh sách bàn
      onClose(); // Đóng popup
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleViewDetails = () => {
    // Điều hướng đến trang chi tiết bàn
    window.location.href = `/table/${table.tableId}`; // Thay thế bằng đường dẫn thực tế của bạn
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Trạng thái Bàn số: {table.tableId}</h2>
        {loading ? (
          <p className="text-center">Đang cập nhật trạng thái...</p> // Hiển thị thông báo loading
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <button onClick={() => handleStatusChange('USING')} className="bg-green-500 text-white px-4 py-2 rounded">Khách vào</button>
              <button onClick={() => handleStatusChange('NOT_USE')} className="bg-blue-500 text-white px-4 py-2 rounded">Khách về</button>
            </div>
            <div className="flex justify-between mb-4">
              <button onClick={() => handleStatusChange('NOT_AVAILABLE')} className="bg-yellow-500 text-white px-4 py-2 rounded">Bảo trì</button>
              <button onClick={() => handleStatusChange('NOT_USE')} className="bg-red-500 text-white px-4 py-2 rounded">Tắt</button>
            </div>
            <div className="flex justify-between">
              <button onClick={handleViewDetails} className="bg-gray-300 px-4 py-2 rounded">Xem chi tiết</button>
              <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Đóng</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableStatusPopup;