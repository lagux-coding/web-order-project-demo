import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

function QRCodeGenerator({ tableId }) {
  const canvasRef = useRef(null);
  const value = `http://192.168.100.2:5173/table?id=${tableId}`;

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, value, { width: 256 }, (error) => {
      if (error) console.error(error);
    });
  }, [value]);

  return (
    <div>
      <h1>Tạo mã QR cho bàn {tableId}</h1>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default QRCodeGenerator;
