import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator';
import OrderPage from './OrderPage';
import Home from './Home';
import Manager from './Manager';
import MenuPage from './MenuPage';
import ManagerKeyInput from './ManagerKeyInput';
import { io } from 'socket.io-client';

const socket = io('https://weborderlagux.mywire.org:5000'); // Connect to the Socket.IO server

socket.emit('clientInfo', {
  userAgent: navigator.userAgent,
  // Bạn có thể thêm thông tin khác nếu cần
});

function App() {
  const [messages, setMessages] = useState([]);
  const [messageAI, setMessageAI] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the listener on unmount
    };
  }, []);

  const sendMessage = (message, sender) => {
    const msg = { text: message, sender };
    socket.emit('sendMessage', msg); // Send message to the server
    // Do not add the message to local state here for the sender
  };

  const sendMessageToAI = (message) => {
    // Logic để xử lý tin nhắn AI, có thể gọi API hoặc cập nhật trạng thái
    const msg = { text: message, sender: 'user' };
    // Gọi API hoặc cập nhật trạng thái ở đây
    // Ví dụ: setMessages((prevMessages) => [...prevMessages, msg]);
  };

  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<ManagerKeyInput />} />
          <Route path="/table" element={<Home messages={messages} sendMessage={sendMessage} messageAI={messageAI} sendMessageToAI={sendMessageToAI} />} />
          <Route path="/generate" element={<QRCodeGenerator />} />
          <Route path="/manager-key" element={<ManagerKeyInput />} />
          <Route path="/manager/*" element={<Manager messages={messages} sendMessage={sendMessage} />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
