import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator'; // Import component tạo mã QR
import OrderPage from './OrderPage'; // Import trang Order
import Home from './Home';
import Manager from './Manager';
import MenuPage from './MenuPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route hiển thị mã QR cho bàn */}
          <Route path="/table" element={<Home />} />
          <Route path="/generate" element={<QRCodeGenerator tableId={13} />} />
          <Route path="/manager/*" element={<Manager />} />
          <Route path="/menu" element={<MenuPage />} /> {/* Add route for MenuPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
