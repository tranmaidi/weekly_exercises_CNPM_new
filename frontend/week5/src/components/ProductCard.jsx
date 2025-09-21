import React, { useState, useEffect } from 'react';
import { Card, Button, Rate, Tag, Space, message, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  addFavoriteApi, 
  removeFavoriteApi, 
  checkFavoriteApi,
  addViewApi 
} from '../util/api';
import { useAuth } from './context/auth.context';

const { Meta } = Card;

const ProductCard = ({ product, showActions = true, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra sản phẩm có trong yêu thích không
  useEffect(() => {
    if (auth.isAuthenticated && product._id) {
      checkFavoriteStatus();
    }
  }, [auth.isAuthenticated, product._id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await checkFavoriteApi(product._id);
      if (response && response.DT !== undefined) {
        setIsFavorite(response.DT);
      }
    } catch (error) {
      console.error('Check favorite error:', error);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!auth.isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavoriteApi(product._id);
        setIsFavorite(false);
        message.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await addFavoriteApi(product._id);
        setIsFavorite(true);
        message.success('Đã thêm vào danh sách yêu thích');
      }
      
      // Gọi callback để cập nhật UI parent
      if (onFavoriteChange) {
        onFavoriteChange(product._id, !isFavorite);
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    // Luôn thêm vào lịch sử xem nếu đã đăng nhập
    if (auth.isAuthenticated) {
      try {
        await addViewApi(product._id);
      } catch (error) {
        console.error('Add view error:', error);
      }
    }
    navigate(`/products/${product._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPromotionPrice = () => {
    if (product.promotionPercent > 0) {
      const discountPrice = product.price * (1 - product.promotionPercent / 100);
      return formatPrice(discountPrice);
    }
    return null;
  };

  const renderPrice = () => {
    const promotionPrice = getPromotionPrice();
    
    if (promotionPrice) {
      return (
        <div>
          <div style={{ color: '#ff4d4f', fontSize: '16px', fontWeight: 'bold' }}>
            {promotionPrice}
          </div>
          <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
            {formatPrice(product.price)}
          </div>
          <Tag color="red" style={{ marginTop: 4 }}>
            -{product.promotionPercent}%
          </Tag>
        </div>
      );
    }
    
    return (
      <div style={{ color: '#1890ff', fontSize: '16px', fontWeight: 'bold' }}>
        {formatPrice(product.price)}
      </div>
    );
  };

  const renderStats = () => (
    <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
      <Space size="small" split="|">
        <span>
          <EyeOutlined /> {product.views || 0}
        </span>
        <span>
          <HeartOutlined /> {product.totalFavorites || 0}
        </span>
        {product.totalSold > 0 && (
          <span>Đã bán: {product.totalSold}</span>
        )}
      </Space>
    </div>
  );

  const renderRating = () => {
    if (product.averageRating > 0) {
      return (
        <div style={{ marginTop: 8 }}>
          <Rate 
            disabled 
            value={product.averageRating} 
            style={{ fontSize: '14px' }}
          />
          <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
            ({product.totalReviews || 0})
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      hoverable
      style={{ width: '100%', marginBottom: 16 }}
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={product.name}
            src={product.thumbnail || '/placeholder-product.jpg'}
            style={{ 
              height: 200, 
              objectFit: 'cover',
              width: '100%'
            }}
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          {showActions && auth.isAuthenticated && (
            <div style={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Tooltip title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
                <Button
                  type="text"
                  shape="circle"
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  style={{ 
                    color: isFavorite ? '#ff4d4f' : '#fff',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: 'none'
                  }}
                  loading={loading}
                  onClick={handleFavorite}
                />
              </Tooltip>
            </div>
          )}
        </div>
      }
      actions={showActions ? [
        <Tooltip title="Xem chi tiết">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={handleView}
          >
            Xem
          </Button>
        </Tooltip>,
        ...(auth.isAuthenticated ? [
          <Tooltip title="Thêm vào giỏ hàng">
            <Button 
              icon={<ShoppingCartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                message.info('Tính năng giỏ hàng đang phát triển');
              }}
            >
              Mua
            </Button>
          </Tooltip>
        ] : [
          <Tooltip title="Đăng nhập để mua hàng">
            <Button 
              icon={<ShoppingCartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                message.warning('Vui lòng đăng nhập để mua hàng');
              }}
            >
              Mua
            </Button>
          </Tooltip>
        ])
      ] : null}
    >
      <Meta
        title={
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            lineHeight: '1.4',
            height: '2.8em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </div>
        }
        description={
          <div>
            {renderPrice()}
            {renderRating()}
            {renderStats()}
            {product.category && (
              <Tag color="blue" style={{ marginTop: 8 }}>
                {product.category.name}
              </Tag>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
