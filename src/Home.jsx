import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import icon
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Autoplay } from 'swiper/modules'; // Import Autoplay
import { Rate } from 'antd'; // Import Rate component from Ant Design

const images = [
  'https://d3design.vn/uploads/Summer%20drink%20menu%20promotion%20banner%20template.jpg',
  'https://d3design.vn/uploads/Summer%20drink%20menu%20promotion%20banner%20template5.jpg',
  'https://d3design.vn/uploads/Summer%20drink%20menu%20promotion%20banner%20template10.jpg',
  'https://intphcm.com/data/upload/poster-tra-sua(1).jpg'
];

const cardImages = [
  'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/operation.png?alt=media&token=26225a38-94f4-496e-96c5-d9cb63044b7e', // Hình cho Thanh Toan
  'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/staff.png?alt=media&token=7a684608-6c9f-4e98-ba0a-b4fe9b8c91b8', // Hình cho Gọi nhân viên
  'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/positive-vote.png?alt=media&token=114438ac-59bd-4a0c-b95c-11ee0ca6fb84', // Hình cho Đánh giá
  'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/order-now.png?alt=media&token=5447dab8-4b0d-4e48-a122-e4a988d1a4ac' // Hình cho Xem menu
];

// URL hình ảnh cho các buổi
const morningIcon = 'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/morning.png?alt=media&token=7de7293a-f10b-4b10-90e6-3a26848403fd'; // Hình ảnh buổi sáng
const noonIcon = 'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/noon.png?alt=media&token=1c97b56e-cee0-4aaf-afc5-1a74f3139051'; // Hình ảnh buổi trưa
const afternoonIcon = 'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/afternoon.png?alt=media&token=be0031b9-25a8-4684-842a-d916706005cc'; // Hình ảnh buổi chiều
const nightIcon = 'https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/cloudy-night.png?alt=media&token=0ac738e1-525d-40af-9fc1-ef015c04f7fb'; // Hình ảnh buổi tối

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [language, setLanguage] = useState('VIE');
  const location = useLocation();  // Lấy thông tin URL hiện tại
  const [tableId, setTableId] = useState(null); // Lưu ID bàn
  const [loading, setLoading] = useState(true); // New loading state
  const [showCallStaffPopup, setShowCallStaffPopup] = useState(false); // New state for popup visibility
  const [isFadingOut, setIsFadingOut] = useState(false); // New state for fade-out effect
  const [showPaymentPopup, setShowPaymentPopup] = useState(false); // New state for payment popup visibility
  const [rating, setRating] = useState(0); // State for rating
  const [feedback, setFeedback] = useState(''); // State for feedback input
  const [showRatingPopup, setShowRatingPopup] = useState(false); // State for rating popup visibility

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableId = params.get('id');
    console.log(tableId);
    setTableId(tableId); // Lưu vào state
    
    // Load images and set loading state
    const imagePromises = [...images, ...cardImages].map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve; // Resolve when image loads
      });
    });

    Promise.all(imagePromises).then(() => {
      setLoading(false); // Set loading to false when all images are loaded
    });

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'VIE' ? 'ENG' : 'VIE'));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'VIE' ? 'Chào buổi sáng' : 'Good morning';
    if (hour < 18) return language === 'VIE' ? 'Chào buổi chiều' : 'Good afternoon';
    return language === 'VIE' ? 'Chào buổi tối' : 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <img src={morningIcon} alt="Buổi sáng" className="w-5 h-5 mr-1" />;
    if (hour >= 12 && hour < 18) return <img src={noonIcon} alt="Buổi trưa" className="w-5 h-5 mr-1" />;
    return <img src={nightIcon} alt="Buổi tối" className="w-5 h-5 mr-1" />;
  };

  // Function to handle calling staff
  const handleCallStaff = () => {
    setShowCallStaffPopup(true); // Show the popup
  };

  // Function to close the popup with fade-out effect
  const closeCallStaffPopup = () => {
    setIsFadingOut(true); // Start fade-out effect
    setTimeout(() => {
      setShowCallStaffPopup(false); // Hide the popup after fade-out
      setIsFadingOut(false); // Reset fade-out state
    }, 300); // Match this duration with your CSS transition duration
  };

  // Function to handle calling payment
  const handleCallPayment = () => {
    setShowPaymentPopup(true); // Show the payment popup
  };

  // Function to close the payment popup with fade-out effect
  const closePaymentPopup = () => {
    setIsFadingOut(true); // Start fade-out effect
    setTimeout(() => {
      setShowPaymentPopup(false); // Hide the popup after fade-out
      setIsFadingOut(false); // Reset fade-out state
    }, 300); // Match this duration with your CSS transition duration
  };

  // Function to handle rating change
  const handleRatingChange = (value) => {
    setRating(value); // Update rating state
  };

  // Function to submit feedback
  const handleSubmitFeedback = () => {
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    // Here you can handle the submission logic (e.g., send to server)
    setShowRatingPopup(false); // Close the popup after submission
    setRating(0); // Reset rating
    setFeedback(''); // Reset feedback
  };

  if (loading) return ( // Loading screen
    <div className="fixed inset-0 bg-white-800 bg-opacity-50 flex flex-col justify-center items-center z-50">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/soda.png?alt=media&token=f074f71a-8fd3-423a-a6c1-dcfd60c70cc3" 
        alt="Loading"
        className="w-16 h-16 animate-spin mb-4"
      />
      <p className="text-black text-lg">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col"> {/* Sử dụng flex để đảm bảo footer ở cuối */}
      <div className="flex-grow p-4 bg-[#fdf5e6] animate-float"> {/* Phần nội dung chính */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tên quán</h1>
          <button 
            onClick={toggleLanguage} 
            className="text-gray-800 px-4 py-2 rounded flex items-center" // Bỏ màu nền
          >
            {language === 'VIE' ? (
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1024px-Flag_of_Vietnam.svg.png" alt="Cờ Việt Nam" className="w-5 h-4 mr-2" />
            ) : (
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="Cờ Mỹ" className="w-5 h-5 mr-2" />
            )}
            {language}
          </button>
        </header>
        <p className="text-gray-600 flex items-center mb-2">
          <FaMapMarkerAlt className="mr-1" /> {language === 'VIE' ? 'Địa chỉ quán' : 'Restaurant Address'}
        </p>     
        <div className="mb-4">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{
              delay: 2500, 
              disableOnInteraction: false, // Không dừng autoplay khi tương tác
            }}
            modules={[Autoplay]} // Kích hoạt module Autoplay
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-center">
            {getGreetingIcon()} {/* Hiển thị icon tương ứng */}
            <h2 className="text-xl text-center">{getGreeting()}</h2> {/* Căn giữa */}
          </div>
          <h3 className="text-lg text-center">{language === 'VIE' ? 'Bạn đang ngồi bàn số' : 'You are sitting at table number'} <strong>{tableId}</strong></h3> {/* Căn giữa */}
        </div>
        <div className="flex justify-between space-x-2"> {/* Thêm khoảng cách giữa các card */}
          <div 
            className="card bg-white shadow-md rounded-lg p-2 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center w-1/3 transform hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer active:scale-95"
            onClick={handleCallPayment} // Add onClick event to trigger the payment popup
          >
            <img src={cardImages[0]} alt="Order" className="w-16 h-16 mb-2" /> 
            <h3 className="text-lg font-semibold text-center">{language === 'VIE' ? 'Gọi thanh toán' : 'Call for Payment'}</h3>
          </div>
          <div 
            className="card bg-white shadow-md rounded-lg p-2 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center w-1/3 transform hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer active:scale-95"
            onClick={handleCallStaff} // Add onClick event to trigger the staff popup
          >
            <img src={cardImages[1]} alt="Gọi nhân viên" className="w-16 h-16 mb-2" /> {/* Hình cho Gọi nhân viên */}
            <h3 className="text-lg font-semibold text-center">{language === 'VIE' ? 'Gọi nhân viên' : 'Call Staff'}</h3>
          </div>
          <div 
            className="card bg-white shadow-md rounded-lg p-2 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center w-1/3 transform hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer active:scale-95"
            onClick={() => setShowRatingPopup(true)} // Show rating popup when clicked
          >
            <img src={cardImages[2]} alt="Đánh giá" className="w-16 h-16 mb-2" /> {/* Hình cho Đánh giá */}
            <h3 className="text-lg font-semibold text-center">{language === 'VIE' ? 'Đánh giá' : 'Review'}</h3>
          </div>
        </div>
        <div className="mt-4 bg-white shadow-md rounded-lg p-6 flex items-center cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95">
          <Link to={`/menu?id=${tableId}`} className="flex items-center w-full">
            <img src={cardImages[3]} alt="Xem menu" className="w-16 h-16 mr-4" />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{language === 'VIE' ? 'Xem menu - Gọi món' : 'View Menu - Order'}</h3>
            </div>
          </Link>
        </div>
        {/* Card Liên hệ với chúng tôi */}
        <div className="mt-4 bg-white shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95">
          <h3 className="text-xl font-semibold">{language === 'VIE' ? 'Liên hệ với chúng tôi' : 'Contact Us'}</h3>
          <p className="text-gray-600">{language === 'VIE' ? 'Điện thoại: 0913 895 657' : 'Phone: 0913 895 657'}</p>
          <p className="text-gray-600">{language === 'VIE' ? 'Email: contact@okquan.com' : 'Email: contact@okquan.com'}</p>
        </div>      

        
      </div>  

      {/* Popup for calling staff */}
      {showCallStaffPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className={`bg-white p-4 rounded-lg shadow-lg max-w-* w-100 flex flex-col items-center animate-zoom-in ${isFadingOut ? 'animate-zoom-out' : ''}`}>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/please.png?alt=media&token=00266930-b326-4b39-9266-65e045e344bc" // Replace with your logo URL
              alt="Logo"
              className="w-20 h-20 mb-5"
            />
            <h2 className="text-lg font-bold">Nhân viên đang đến...</h2>
            <p className="text-center mt-2">Bạn đợi chúng tôi tí xíu nhé</p>
            <button
              className="mt-4 bg-orange-300 text-black px-6 py-2 rounded-xl"
              onClick={closeCallStaffPopup} // Call the function to close the popup
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}

      {/* Popup for calling payment */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className={`bg-white p-4 rounded-lg shadow-lg max-w-* w-100 flex flex-col items-center animate-zoom-in ${isFadingOut ? 'animate-zoom-out' : ''}`}>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/please.png?alt=media&token=00266930-b326-4b39-9266-65e045e344bc" // Replace with your payment logo URL
              alt="Logo"
              className="w-20 h-20 mb-5"
            />
            <h2 className="text-lg font-bold">Gọi thanh toán...</h2>
            <p className="text-center mt-2">Chúng tôi sẽ đến ngay!</p>
            <button
              className="mt-4 bg-orange-300 text-black px-6 py-2 rounded-xl"
              onClick={closePaymentPopup} // Call the function to close the popup
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className={`bg-white p-4 rounded-lg shadow-lg max-w-2xl w-5/6 flex flex-col items-center ${isFadingOut ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
            <h2 className="text-lg pb-2 font-bold">Đánh giá của bạn</h2>
            <Rate onChange={handleRatingChange} value={rating} style={{ fontSize: '32px' }}/> {/* Rating component */}
            <textarea
              className="mt-4 w-full p-2 border rounded"
              rows={4}
              placeholder="Phản hồi của bạn giúp chúng tôi tốt hơn."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)} // Update feedback state
            />
            <button
              className="mt-4 bg-orange-300 text-black px-6 py-2 rounded-xl"
              onClick={() =>{
                setIsFadingOut(true); // Bắt đầu hiệu ứng fade-out
                setTimeout(() => {
                  setShowRatingPopup(false); // Đóng popup sau khi fade-out
                  setIsFadingOut(false); // Reset trạng thái fade-out
                }, 300);
              }} // Submit feedback
            >
              Gửi
            </button>
            <button
              className="mt-2 text-black"
              onClick={() => {
                setIsFadingOut(true); // Bắt đầu hiệu ứng fade-out
                setTimeout(() => {
                  setShowRatingPopup(false); // Đóng popup sau khi fade-out
                  setIsFadingOut(false); // Reset trạng thái fade-out
                }, 300); // Thời gian khớp với thời gian hiệu ứng CSS
              }} // Close popup
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-white text-center">
        <p>&copy; 2023 Tên quán. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Home;