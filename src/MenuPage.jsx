import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid'; // Sử dụng Heroicons v2

const MenuPage = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableId, setTableId] = useState(null); // Lưu ID bàn
  const [cart, setCart] = useState({}); // Giỏ hàng
  const [notification, setNotification] = useState(''); // Thông báo tạm thời
  const [showCartDetails, setShowCartDetails] = useState(false); // Trạng thái hiển thị chi tiết giỏ hàng
  const [orderSuccess, setOrderSuccess] = useState(false); // Trạng thái đơn hàng thành công
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Trạng thái hiển thị hộp thoại xác nhận
  const [searchTerm, setSearchTerm] = useState(''); // State để lưu giá trị tìm kiếm
  const [isLoading, setIsLoading] = useState(false); // Trạng thi loading
  const [isClosing, setIsClosing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Thêm state để theo dõi việc đã fetch dữ liệu
  const [removingItemId, setRemovingItemId] = useState(null); // Thêm state để theo dõi sản phẩm đang bị xóa
  const [editingItemId, setEditingItemId] = useState(null); // Thêm state để theo dõi sản phẩm đang được chỉnh sửa
  const [newQuantity, setNewQuantity] = useState(1); // State để lưu số lượng mới
  const [dataFetched, setDataFetched] = useState(false); // Thêm state để theo dõi việc fetch dữ liệu
  const [milkTeaItems, setMilkTeaItems] = useState([]);
  const [currentItemType, setCurrentItemType] = useState('ALL'); // State để theo dõi loại item hiện tại
  const [itemToRemove, setItemToRemove] = useState(null); // Thêm state để theo dõi item đang bị xóa
  const [isZoomingOut, setIsZoomingOut] = useState(false); // Thêm state để theo dõi hiệu ứng zoom-out
  const [isBouncing, setIsBouncing] = useState(false); // Thêm state để theo dõi hiệu ứng nhún
  const [itemToBounce, setItemToBounce] = useState(null); // Thêm state để theo dõi item đang nhún
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Thêm state để theo dõi tình trạng tải hình ảnh
  const [notificationVisible, setNotificationVisible] = useState(false); // Thêm state để theo dõi trạng thái hiển thị thông báo
  const [itemToZoomOut, setItemToZoomOut] = useState(null); // Thêm state để theo dõi item đang zoom-out

  // Định nghĩa hàm để lấy các item trà sữa
  const getMilkTeaItems = (items) => {
    return items.filter(item => item.typeStatus === 'MILK_TEA');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    setTableId(id); // Lưu ID bàn vào state

    const fetchItems = async () => {
      try {
        const response = await axios.get('https://weborderlagux.mywire.org:8444/item/get-all'); // Thay x.x bằng địa chỉ IP thực tế
        setItems(response.data);
        setHasFetched(true); // Đánh dấu là đã fetch dữ liệu
        setDataFetched(true); // Đánh dấu là đã fetch dữ liệu
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [location]);

  // Hàm lọc món ăn dựa trên giá trị tìm kiếm và loại item hiện tại
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const isCurrentType = currentItemType === 'ALL' || item.typeStatus === currentItemType;
    return matchesSearch && isCurrentType;
  });

  // Hàm để cập nhật loại item hiện tại
  const handleShowItemType = (type) => {
    setCurrentItemType(type); // Cập nhật loại item hiện tại
  };

  const handleAddToCart = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
    setNotification('Món ăn đã được thêm vào giỏ hàng!');
    setNotificationVisible(true); // Hiển thị thông báo

    // Thêm timeout để ẩn thông báo sau 2 giây
    setTimeout(() => {
      // Thêm lớp fade-out trước khi ẩn thông báo
      const notificationElement = document.querySelector('.notification');
      if (notificationElement) {
        notificationElement.classList.add('fade-out'); // Thêm lớp fade-out
      }

      // Ẩn thông báo sau khi hiệu ứng fade-out hoàn tất
      setTimeout(() => {
        setNotificationVisible(false); // Ẩn thông báo
        setNotification(''); // Xóa nội dung thông báo
      }, 500); // Thời gian chờ bằng với thời gian fade-out
    }, 2000); // 2000ms = 2 giây
  };

  const calculateTotalPrice = () => {
    return Object.keys(cart).reduce((total, itemId) => {
      const item = items.find(item => item.itemId === parseInt(itemId, 10)); // Chuyển đổi itemId sang số
      return total + (item ? item.price * cart[itemId] : 0);
    }, 0);
  };

  const handleOrder = () => {
    if (Object.keys(cart).length === 0) {
      setNotification('Giỏ hàng trống! Vui lòng thêm món khi đặt order.'); // Hiển thị thông báo
      setTimeout(() => setNotification(''), 3000); // Ẩn thông báo sau 3 giây
      return; // Ngăn không cho tiếp tục
    }
    setShowConfirmDialog(true); // Hiển thị hộp thoại xác nhận
  };

  const confirmOrder = () => {
    setIsLoading(true); // Bắt đầu loading
    setTimeout(() => {
      setOrderSuccess(true); // Đặt trạng thái đơn hàng thành công
      setCart({}); // Xóa giỏ hàng sau khi đặt hàng
      setShowCartDetails(false); // Đóng chi tiết giỏ hàng
      setShowConfirmDialog(false); // Ẩn hộp thoại xác nhận
      setIsLoading(false); // Kết thúc loading
    }, 2000); // Giả lập thời gian xử lý đơn hàng
  };

  const cancelOrder = () => {
    setShowConfirmDialog(false); // Ẩn hộp thoại xác nhận
  };

  // Hàm để cập nhật loại item hiện tại là tất cả
  const handleShowAllItems = () => {
    setCurrentItemType('ALL'); // Đặt loại item hiện tại là 'ALL'
    setSearchTerm(''); // Đặt lại giá trị tìm kiếm để hiển thị tất cả các item
  };

  // Hàm để xóa tất cả các món trong giỏ hàng
  const clearAllCartItems = () => {
    // Đánh dấu tất cả các item là đang bị xóa
    setItemToZoomOut(Object.keys(cart)); // Lưu tất cả itemId vào state

    // Thêm timeout để xóa giỏ hàng sau khi hiệu ứng hoàn tất
    setTimeout(() => {
      setCart({}); // Đặt giỏ hàng về trạng thái rỗng
      setNotification('Đã xóa tất cả món trong giỏ hàng!'); // Hiển thị thông báo
      setNotificationVisible(true); // Hiển thị thông báo

      // Thêm timeout để ẩn thông báo sau 2 giây
      setTimeout(() => {
        setNotificationVisible(false); // Ẩn thông báo
        setNotification(''); // Xóa nội dung thông báo
      }, 2000); // 2000ms = 2 giây

      setShowCartDetails(false); // Tắt bảng chi tiết giỏ hàng
      setItemToZoomOut(null); // Đặt lại trạng thái zoom-out
    }, 300); // Thời gian chờ bằng với thời gian hiệu ứng
  };

  const handleRemoveItem = (itemId) => {
    setItemToZoomOut(itemId); // Đánh dấu item đang bị xóa
    setTimeout(() => {
      const newCart = { ...cart };
      delete newCart[itemId]; // Xóa món ăn khỏi giỏ hàng
      setCart(newCart); // Cập nhật giỏ hàng
      setItemToZoomOut(null); // Đặt lại trạng thái
    }, 300); // Thời gian chờ bằng với thời gian hiệu ứng
  };

  if (loading) return (
    <div className="fixed inset-0 bg-white-800 bg-opacity-50 flex flex-col justify-center items-center z-50">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/soda.png?alt=media&token=f074f71a-8fd3-423a-a6c1-dcfd60c70cc3" // Thay đổi đường dẫn đến logo của bạn
        alt="Loading"
        className="w-16 h-16 animate-spin mb-4" // Kích thước logo và hiệu ứng xoay
      />
      <p className="text-black text-lg">Đang tải dữ liệu...</p> {/* Thay đổi chữ ở đây */}
    </div>
  );
  if (error) return <p className="text-red-500 text-center">Lỗi: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-4">
        <div className="flex items-center mb-4">
          <Link to={`/table?id=${tableId}`} className="flex items-center">
            <HomeIcon className="h-6 w-6 text-orange-400 mr-2" /> {/* Biểu tượng ngôi nhà */}
          </Link>
          <input 
            type="text" 
            placeholder="Tìm kiếm món ở đây..." 
            className="border rounded-lg p-2 flex-grow" 
            value={searchTerm} // Gán giá trị tìm kiếm
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
          />
        </div>

    {/* Thêm tag cho các loại item */}
    <div className="mb-4 flex flex-wrap">
        <button onClick={() => handleShowItemType('ALL')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Tất cả</button>
        <button onClick={() => handleShowItemType('MILK_TEA')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Trà sữa</button>
        <button onClick={() => handleShowItemType('SOFT_DRINK')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Nước ngọt</button>
        <button onClick={() => handleShowItemType('SWEET_SOUP')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Chè</button>
        <button onClick={() => handleShowItemType('SMOOTHIE')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Sinh tố</button>
        <button onClick={() => handleShowItemType('JUICE')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Nước ép</button>
        <button onClick={() => handleShowItemType('COFFEE')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Coffee</button>
        <button onClick={() => handleShowItemType('TEA')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Trà</button>
        <button onClick={() => handleShowItemType('OTHER')} className="tag-button min-w-[100px] h-10 mx-2 my-1 rounded-full">Khác</button>
    </div>

        {/* Hiển thị các item dựa trên loại hiện tại */}
        <div className="grid grid-cols-2 gap-4">
          {filteredItems
            .sort((a, b) => (a.status === 'OUT_OF_STOCK' ? 1 : 0) - (b.status === 'OUT_OF_STOCK' ? 1 : 0)) // Sắp xếp để các món hết hàng nằm cuối
            .map((item) => (
              <div 
                key={item.itemId} 
                className={`bg-white shadow-md rounded-lg p-2 flex flex-col items-center relative transition-transform duration-200 ease-in-out 
                  ${itemToBounce === item.itemId ? 'animate-bounce' : 'animate-float'}`} // Thêm lớp animate-bounce khi nhấn và animate-float khi hiển thị
                onClick={() => {
                  if (item.status !== 'OUT_OF_STOCK') {
                    handleAddToCart(item.itemId);
                    setItemToBounce(item.itemId); // Đánh dấu item đang nhún
                    setIsBouncing(true); // Kích hoạt hiệu ứng nhún
                    setTimeout(() => {
                      setIsBouncing(false); // Đặt lại trạng thái sau khi hiệu ứng hoàn tất
                      setItemToBounce(null); // Đặt lại item đang nhún
                    }, 300); // Thời gian hiệu ứng
                  }
                }} // Nhấn vào hình ảnh để thêm vào giỏ hàng nếu không hết hàng
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.itemName} 
                  className={`w-full h-32 object-cover rounded mb-2 ${item.status === 'OUT_OF_STOCK' ? 'opacity-50' : ''}`} 
                />
                {item.status === 'OUT_OF_STOCK' && (
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center p-1 rounded-t-lg">
                    Hết hàng
                  </div>
                )}
                <h3 className="text-lg font-semibold">{item.itemName}</h3>
                <p className="font-bold">{item.price.toLocaleString()} VND</p>
              </div>
            ))}
        </div>

        {/* Hiển thị thông báo tạm thời với animation */}
        {notification && (
          <div className={`notification bg-green-500 text-white p-4 rounded-lg shadow-lg animate-slide-down ${notificationVisible ? '' : 'fade-out'}`}>
            {notification}
          </div>
        )}
      </div>

      {/* Hiển thị giỏ hàng cố định ở dưới cùng */}
      <div className={`bg-orange-400 shadow-lg p-2 cursor-pointer transition-transform duration-300 ease-in-out ${Object.keys(cart).length === 0 ? 'h-15' : 'h-auto'}`} style={{ position: 'sticky', bottom: 0 }} onClick={() => setShowCartDetails(!showCartDetails)}>
        <h2 className="text-lg font-bold">Giỏ hàng</h2>
        <p>Tổng giá: {calculateTotalPrice().toLocaleString()} VND</p>
        {showCartDetails ? (
          <span className="text-center block">▲</span> // Mũi tên lên
        ) : (
          <span className="text-center block">▼</span> // Mũi tên xuống
        )}
      </div>

      {/* Chi tiết giỏ hàng với animation */}
      {showCartDetails && (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out`}>
          <div className={`bg-white p-4 rounded-lg shadow-lg max-w-lg w-full h-3/4 flex flex-col transform transition-transform duration-500 ease-in-out max-w-md mx-4 animate-slide-up`} style={{ transform: showCartDetails ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0)' }}>
            <h2 className="text-lg font-bold mb-2">Chi tiết giỏ hàng</h2>
            <div className="flex-grow overflow-y-auto"> {/* Phần cuộn cho nội dung giỏ hàng */}
              {Object.keys(cart).length === 0 ? (
                <p>Giỏ hàng trống</p>
              ) : (
                Object.keys(cart).map((itemId) => {
                  const item = items.find(item => item.itemId === parseInt(itemId, 10)); // Chuyển đổi itemId sang số
                  return (
                    <div key={itemId} className={`flex items-center border-b py-2 ${itemToZoomOut?.includes(itemId) ? 'animate-zoom-out' : ''}`}>
                      <img 
                        src={item?.imageUrl} 
                        alt={item?.itemName} 
                        className="w-16 h-16 object-cover rounded mr-4" 
                      />
                      <div className="flex-1">
                        <h3 className="text-md font-semibold">{item?.itemName}</h3>
                        <p className="text-lg font-bold">{item?.price.toLocaleString()} VND</p>
                      </div>
                      <div className="flex items-center mr-4">
                        <p className="mx-2 text-sm">Số lượng: {cart[itemId]}</p>
                        <button 
                          className="text-red-500 ml-2" 
                          onClick={() => handleRemoveItem(itemId)} // Gọi hàm xóa item
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button 
                          className="bg-gray-200 px-2 py-1 rounded" 
                          onClick={() => {
                            const newCart = { ...cart };
                            if (newCart[itemId] > 1) {
                              newCart[itemId] -= 1; // Giảm số lượng
                              setCart(newCart); // Cập nhật giỏ hàng
                            }
                          }}
                        >
                          -
                        </button>
                        <p className="mx-2">{cart[itemId]}</p>
                        <button 
                          className="bg-gray-200 px-2 py-1 rounded" 
                          onClick={() => {
                            const newCart = { ...cart };
                            newCart[itemId] = (newCart[itemId] || 0) + 1; // Tăng số lượng
                            setCart(newCart); // Cập nhật giỏ hàng
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-lg font-bold mt-4">
              Tổng giá: {calculateTotalPrice().toLocaleString()} VND
            </p>
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <button 
                  className="bg-red-500 text-white px-6 py-2 rounded-full" 
                  onClick={() => setShowCartDetails(false)} // Đóng giỏ hàng
                >
                  Đóng
                </button>
                <button 
                  className="bg-blue-500 text-white px-6 py-2 rounded-full" 
                  onClick={handleOrder} // Gi hàm xử lý đặt hàng
                >
                  Order
                </button>
                <button 
                  className="bg-yellow-500 text-white px-6 py-2 rounded-full" 
                  onClick={clearAllCartItems} // Gọi hàm xóa tất cả món trong giỏ hàng
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hộp thoại xác nhận đặt hàng */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-lg max-w-* w-auto animate-zoom-in">
            <h2 className="text-lg pl-10 pr-10 pt-3 pb-0 font-bold mb-2">Xác nhận Order</h2>
            <p className="text-lg pl-10 pr-10 mb-2">Bạn chắc chắn muốn order?</p>
            <div className="flex mt-4">
              <button 
                className="flex-1 bg-white-500 text-black px-4 py-2 rounded-bl-2xl button-press" 
                onClick={cancelOrder} // Nút Hủy
              >
                Hủy
              </button>
              <button 
                className="flex-1 bg-green-500 text-black px-4 py-2 rounded-br-2xl button-press" 
                onClick={confirmOrder} // Nút Xác nhận
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Màn hình loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center z-50">
          <img src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/soda.png?alt=media&token=f074f71a-8fd3-423a-a6c1-dcfd60c70cc3" alt="Loading" className="w-16 h-16 animate-spin" /> {/* Thay đổi đường dẫn đến logo của bạn */}
          <p className="text-white mt-4">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Popup thông báo thành công */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div
            className={`bg-white p-4 rounded-lg shadow-lg flex flex-col items-center max-w-md mx-4 ${
              isClosing ? "animate-zoom-out" : "animate-zoom-in"
            }`}
          >
            {!isImageLoaded && isLoading && <p>Đang tải...</p>} {/* Hiển thị thông báo đang tải nếu hình ảnh chưa tải xong */}
            <img
              src="https://firebasestorage.googleapis.com/v0/b/website-4922d.appspot.com/o/checkmark.png?alt=media&token=ed49cf4b-cfa8-4a03-a14e-f511b0165dc0"
              alt="order thành công"
              className="w-16 h-16 mb-2"
              onLoad={() => {
                setIsImageLoaded(true); // Cập nhật trạng thái khi hình ảnh được tải xong
                setIsLoading(false); // Kết thúc loading khi hình ảnh đã tải
              }}
              onError={() => {
                setIsImageLoaded(true); // Cập nhật trạng thái nếu có lỗi
                setIsLoading(false); // Kết thúc loading khi có lỗi
              }}
            />
            <h2 className="text-lg font-bold">Order thành công</h2>
            <p className="text-left mt-2">Các món bạn gọi đã gửi tới nhân viên</p>
            <p className="text-left">Chúng tôi sẽ lên món trong thời gian sớm nhất</p>
            <p className="text-left">Chờ chút nhé!</p>
            <div className="bg-gray-200 p-4 rounded mt-4 w-full">
              <p className="text-left">
                Lưu ý: Nếu đợi quá lâu hoặc có thay đổi về món, bạn có thể dùng chức
                năng Gọi nhân viên ở màn hình chính.
              </p>
            </div>
            <button
              className="mt-4 bg-orange-300 text-white px-6 py-2 rounded-xl pl-10 pr-10"
              onClick={() => {
                setIsClosing(true); // Kích hoạt hiệu ứng zoom-out
                setTimeout(() => {
                  setOrderSuccess(false); // Ẩn modal sau khi hiệu ứng hoàn tất
                  setIsClosing(false); // Đặt lại trạng thái
                }, 300); // Thời gian chờ bằng với thời gian hiệu ứng
              }}
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;