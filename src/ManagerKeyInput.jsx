import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerKeyInput = () => {
  const [managerKey, setManagerKey] = useState('');
  const navigate = useNavigate();
  const correctKey = '123123'; // Thay thế bằng key manager thực tế

  const handleSubmit = (e) => {
    e.preventDefault();
    if (managerKey === correctKey) {
      localStorage.setItem('managerKey', managerKey); // Lưu key vào localStorage
      navigate('/generate'); // Chuyển hướng đến màn hình tạo QR code
    } else {
      alert('Key manager không đúng!'); // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Nhập Key Manager</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nhập key manager" 
            value={managerKey} 
            onChange={(e) => setManagerKey(e.target.value)} // Cập nhật state khi nhập
            required
            className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-200"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerKeyInput;