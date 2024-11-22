const ProductItem = ({ product, onImageClick }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ flex: '0 0 80px', cursor: 'pointer' }} onClick={() => onImageClick(product.imageUrl)}>
          <img src={product.imageUrl || 'Không có hình ảnh'} alt={product.itemName} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <div style={{ flex: '1', marginLeft: '10px' }}>
          <div><strong>Tên:</strong> {product.itemName}</div>
          <div><strong>Mô tả:</strong> {product.description}</div>
        </div>
      </div>
    );
  };