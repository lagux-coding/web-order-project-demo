import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Trang OrderPage sẽ lấy ID bàn từ URL
const OrderPage = () => {
  const location = useLocation();  // Lấy thông tin URL hiện tại
  const [tableId, setTableId] = useState(null); // Lưu ID bàn

  useEffect(() => {
    // Lấy tham số 'id' từ URL
    const params = new URLSearchParams(location.search);
    const tableId = params.get('id');
    console.log(tableId)
    setTableId(tableId); // Lưu vào state
  }, [location]);

  return (
    <div>
      {tableId ? (
        <h1>Order for Table {tableId}</h1>  
      ) : (
        <h1>Loading...</h1>  
      )}
    </div>
  );
};

export default OrderPage;
