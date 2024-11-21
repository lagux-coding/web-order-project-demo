import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function QRCodeGenerator() {
  const [tableId, setTableId] = useState(''); // State để lưu số bàn
  const canvasRef = useRef(null);
  const defaultLink = 'https://weborderlagux.netlify.app/manager'; // Link mặc định
  const value = tableId ? `https://weborderlagux.netlify.app/table?id=${tableId}` : defaultLink; // Sử dụng link mặc định nếu không có số bàn
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    // Kiểm tra nếu người dùng truy cập vào /generate mà không có key hợp lệ
    const key = localStorage.getItem('managerKey'); // Giả sử bạn lưu key vào localStorage
    if (!key) {
      navigate('/manager-key'); // Điều hướng đến /manager-key nếu không có key
    }
  }, [navigate]); // Chỉ cần navigate trong dependency

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, value, { width: 256 }, (error) => {
      if (error) console.error(error);
    });
  }, [value]); // Chỉ cần value trong dependency

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Tạo mã QR cho bàn</h1>
        <input 
          type="text" 
          placeholder="Nhập số bàn" 
          value={tableId} 
          onChange={(e) => setTableId(e.target.value)} // Cập nhật state khi nhập
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={() => setTableId(tableId)} // Gọi lại hàm để tạo QR
          className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-200"
        >
          Tạo QR
        </button>
        <canvas ref={canvasRef} className="mt-4" />
      </div>
    </div>
  );
}

export default QRCodeGenerator;