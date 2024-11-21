import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; // Import the send icon

const ChatManager = ({ messages, sendMessage, onClose }) => {
  const [message, setMessage] = useState('');
  const [isZoomingOut, setIsZoomingOut] = useState(false); // State for zoom-out animation
  const messagesEndRef = useRef(null); // Create a ref for the end of the messages
  const textareaRef = useRef(null); // Create a ref for the textarea
  const [unreadCount, setUnreadCount] = useState(0); // State to track unread messages

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message, 'manager'); // Send message as manager
      setMessage(''); // Clear input
      textareaRef.current.focus(); // Đặt con trỏ vào ô nhập
    }
  };

  const handleClose = () => {
    setIsZoomingOut(true); // Trigger zoom-out animation
    setTimeout(() => {
      onClose(); // Call the onClose function after the animation
    }, 300); // Match this duration with your CSS transition duration
  };

  // Scroll to the bottom of the messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Run this effect whenever messages change

  // Update unread count when new messages arrive
  useEffect(() => {
    const newMessages = messages.filter(msg => msg.sender !== 'manager'); // Assuming messages from the manager are not unread
    setUnreadCount(newMessages.length);
  }, [messages]);

  return (
    <div className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50`}>
      <div className={`bg-white p-6 rounded shadow-md w-80 ${isZoomingOut ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          Chat với Khách hàng
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">{unreadCount}</span>
          )}
        </h2>
        <div className="h-60 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'manager' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-3 pt-1 pb-1 rounded-full ${msg.sender === 'manager' ? 'bg-green-500 text-white' : 'bg-gray-300'} animate-slide-up`}>
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} /> 
        </div>
        <div className="flex items-center bg-white border-2 border-gray-300 rounded-full">
          <textarea
            ref={textareaRef} // Attach the ref to the textarea
            className="border-0 w-full resize-none focus:outline-none pl-2 pt-2 pb-2 leading-5 h-9 rounded-full"
            rows={1}
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-white-500 text-black p-2 pr-4 rounded-r flex items-center"
            onClick={handleSendMessage}
            disabled={!message.trim()} // Disable button if message is empty
          >
            <FaPaperPlane />
          </button>
        </div>
        <button
          className="mt-2 bg-gray-300 text-black px-4 py-2 rounded"
          onClick={handleClose} // Use handleClose for the button
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ChatManager;