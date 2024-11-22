import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Anthropic from '@anthropic-ai/sdk';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const anthropic = new Anthropic({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

const AIChat = ({ messages, setMessages, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSendMessage = async () => {
    console.log("Sending message:", message);
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsTyping(true);

    try {
      setRequestCount(prevCount => prevCount + 1);
      const suggestionResponse = await fetchSuggestion(message);
      console.log("API Response:", suggestionResponse);

      const aiMessage = { text: suggestionResponse || 'Không có phản hồi từ API.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching API response:", error);
      const errorMessage = { text: 'Xin lỗi, đã có lỗi xảy ra khi lấy đề xuất.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }

    setMessage('');
    textareaRef.current.focus();
  };

  const fetchSuggestion = async (userInput) => {
    try {
      const response = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "user", content: `Vui lòng trả lời bằng tiếng Việt: ${userInput}` }
        ],
      });
      return response.choices[0]?.message?.content;
    } catch (error) {
      console.error('Error in fetchSuggestion:', error);
      throw error;
    }
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    console.log(`Total requests sent: ${requestCount}`);
  }, [requestCount]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleClose = () => {
    setIsZoomingOut(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50`}>
      <div className={`bg-white p-6 rounded shadow-md w-80 ${isZoomingOut ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
        <h2 className="text-xl font-bold mb-4">Chat với AI</h2>
        <div className="h-60 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`message-container inline-block p-3 pt-1 pb-1 ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-full' : 'bg-gray-300 rounded-2xl'} animate-slide-up`}>
                {msg.text}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center">
              <span className="dot animate-bounce">.</span>
              <span className="dot animate-bounce delay-200">.</span>
              <span className="dot animate-bounce delay-400">.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center bg-white border-2 border-gray-300 rounded-full">
          <textarea
            ref={textareaRef}
            className="textarea border-0 w-full resize-none focus:outline-none pl-2 pt-2 pb-2 leading-5 h-9 rounded-full"
            rows={1}
            placeholder="Nhập yêu cầu của bạn..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight(e);
            }}
          />
          <button
            className="bg-white-500 text-black p-2 pr-4 rounded-r flex items-center"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
        <button className="mt-2 bg-gray-300 text-black px-4 py-2 rounded" onClick={handleClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default AIChat;
