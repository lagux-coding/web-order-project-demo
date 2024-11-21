import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Import Navbar
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import AddTablePopup from './AddTablePopup'; // Import Popup
import TableStatusPopup from './TableStatusPopup'; // Import Popup để thay đổi trạng thái

const Manager = () => {
  const [tables, setTables] = useState([]); // State để lưu danh sách bàn
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để lưu thông báo lỗi
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State để theo dõi trạng thái popup thêm bàn
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false); // State để theo dõi trạng thái popup thay đổi trạng thái
  const [selectedTable, setSelectedTable] = useState(null); // State để lưu bàn được chọn
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  useEffect(() => {
    fetchTables(); // Gọi hàm fetchTables khi component mount
  }, []); // Chỉ chạy một lần khi component mount

  const fetchTables = async () => {
    try {
      const response = await axios.get('https://weborderlagux.mywire.org:8444/table/get-all'); // Thay thế bằng URL API thực tế
      setTables(response.data); // Lưu dữ liệu vào state
    } catch (err) {
      setError(err.message); // Lưu thông báo lỗi vào state
    } finally {
      setLoading(false); // Đặt loading thành false sau khi fetch xong
    }
  };

  // Hàm để xác định màu sắc và chữ hiển thị dựa trên trạng thái
  const getStatusDetails = (status) => {
    switch (status) {
      case 'USING':
        return { color: 'bg-red-500 text-white', displayText: 'Đang sử dụng' }; // Màu đỏ cho trạng thái đang sử dụng
      case 'NOT_USE':
        return { color: 'bg-green-500 text-white', displayText: 'Trống' }; // Màu xanh cho trạng thái trống
      case 'NOT_AVAILABLE':
        return { color: 'bg-yellow-500 text-white', displayText: 'Bảo trì' }; // Màu vàng cho trạng thái bảo trì
      default:
        return { color: 'bg-gray-300 text-black', displayText: 'Không xác định' }; // Màu xám cho trạng thái khác
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table); // Lưu bàn được chọn
    setIsStatusPopupOpen(true); // Mở popup thay đổi trạng thái
  };

  const handleAddTable = () => {
    setIsPopupOpen(true); // Mở popup thêm bàn
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Đóng popup thêm bàn
  };

  const handleCloseStatusPopup = () => {
    setIsStatusPopupOpen(false); // Đóng popup thay đổi trạng thái
  };

  const handleTableAdded = () => {
    fetchTables(); // Tải lại danh sách bàn sau khi thêm thành công
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf5e6]"> {/* Sử dụng flex-col để đảm bảo footer ở dưới cùng */}
      <div className="flex-grow flex"> {/* Phần nội dung chính */}
        <Navbar /> {/* Hiển thị Navbar bên trái */}
        <div className="flex-grow p-4">
          <header className="flex justify-between items-center mb-4"> {/* Căn chỉnh tiêu đề và nút */}
            <h1 className="text-2xl font-bold">Quản lý</h1>
            <button 
              onClick={handleAddTable} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Thêm Bàn
            </button>
          </header>
          {loading ? (
            <p>Đang tải dữ liệu...</p> // Hiển thị thông báo khi đang tải
          ) : error ? (
            <p className="text-red-500">Lỗi: {error}</p> // Hiển thị thông báo lỗi nếu có
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => {
                const { color, displayText } = getStatusDetails(table.status); // Lấy màu sắc và chữ hiển thị
                return (
                  <div 
                    key={table.id} 
                    className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105" 
                    onClick={() => handleTableClick(table)} // Gọi hàm khi nhấp vào bàn
                  >
                    <h2 className="text-lg font-semibold">Bàn số: {table.tableId}</h2>
                    <p className={`p-2 rounded ${color}`}> {/* Áp dụng màu sắc cho trạng thái */}
                      Trạng thái: {displayText} {/* Hiển thị chữ tương ứng */}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <footer className="p-4 bg-gray-800 text-white text-center w-full">
        <p>&copy; 2023 Tên quán. Tất cả quyền được bảo lưu.</p>
      </footer>
      {isPopupOpen && (
        <AddTablePopup onClose={handleClosePopup} onTableAdded={handleTableAdded} />
      )}
      {isStatusPopupOpen && selectedTable && (
        <TableStatusPopup 
          table={selectedTable} 
          onClose={handleCloseStatusPopup} 
          onStatusChanged={fetchTables} 
        />
      )}
    </div>
  );
};

export default Manager;