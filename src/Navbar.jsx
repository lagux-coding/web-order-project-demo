import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true); // State để theo dõi trạng thái mở/đóng

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-gray-800 text-white h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <button onClick={toggleNavbar} className="text-white p-2">
        {isOpen ? '⮜' : '⮞'} {/* Biểu tượng để mở/đóng */}
      </button>
      <h2 className={`text-xl font-bold mb-4 ${isOpen ? 'block' : 'hidden'}`}>Quản lý</h2>
      <ul>
        <li className="mb-2">
          <Link to="/manager/tables" className="hover:text-gray-300">{isOpen ? 'Quản lí bàn' : 'Bàn'}</Link>
        </li>
        <li className="mb-2">
          <Link to="/manager/orders" className="hover:text-gray-300">{isOpen ? 'Quản lí order' : 'Order'}</Link>
        </li>
        <li className="mb-2">
          <Link to="/manager/inventory" className="hover:text-gray-300">{isOpen ? 'Quản lí kho' : 'Kho'}</Link>
        </li>
        <li className="mb-2">
          <Link to="/manager/invoices" className="hover:text-gray-300">{isOpen ? 'Quản lí hóa đơn' : 'Hóa đơn'}</Link>
        </li>
        <li className="mb-2">
          <Link to="/manager/feedback" className="hover:text-gray-300">{isOpen ? 'Quản lí feedback' : 'Feedback'}</Link>
        </li>
        <li className="mb-2">
          <Link to="/manager/settings" className="hover:text-gray-300">{isOpen ? 'Cấu hình app' : 'Cấu hình'}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;