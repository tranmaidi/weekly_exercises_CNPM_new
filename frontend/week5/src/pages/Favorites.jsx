import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Empty, 
  message, 
  Spin,
  Pagination,
  Space,
  Popconfirm
} from 'antd';
import { DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getFavoritesApi, removeFavoriteApi } from '../util/api';
import { useAuth } from '../components/context/auth.context';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchFavorites();
    }
  }, [auth.isAuthenticated, pagination.page]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoritesApi({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response) {
        setFavorites(response.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Fetch favorites error:', error);
      message.error('Có lỗi xảy ra khi tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await removeFavoriteApi(productId);
      if (response && response.EC === 0) {
        message.success('Đã xóa khỏi danh sách yêu thích');
        setFavorites(prev => prev.filter(item => item.product._id !== productId));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } else {
        message.error(response?.EM || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Remove favorite error:', error);
      message.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleFavoriteChange = (productId, isFavorite) => {
    if (!isFavorite) {
      setFavorites(prev => prev.filter(item => item.product._id !== productId));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Empty
            image={<HeartOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />}
            description={
              <div>
                <p style={{ fontSize: '18px', marginBottom: 16 }}>Vui lòng đăng nhập để xem danh sách yêu thích</p>
                <Button type="primary" size="large" onClick={() => navigate('/login')}>
                  Đăng nhập ngay
                </Button>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Empty
            image={<HeartFilled style={{ fontSize: 64, color: '#ff4d4f' }} />}
            description="Chưa có sản phẩm yêu thích nào"
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title={
          <Space>
            <HeartFilled style={{ color: '#ff4d4f' }} />
            Sản phẩm yêu thích ({pagination.total})
          </Space>
        }
        extra={
          <Button 
            type="link" 
            danger
            onClick={() => {
              // Có thể thêm chức năng xóa tất cả
              message.info('Tính năng xóa tất cả đang phát triển');
            }}
          >
            Xóa tất cả
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {favorites.map((favorite) => (
            <Col xs={12} sm={8} md={6} lg={4} key={favorite._id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={favorite.product.name}
                      src={favorite.product.thumbnail || '/placeholder-product.jpg'}
                      style={{ 
                        height: 200, 
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8
                    }}>
                      <Popconfirm
                        title="Xóa khỏi danh sách yêu thích?"
                        onConfirm={() => handleRemoveFavorite(favorite.product._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          type="text"
                          shape="circle"
                          icon={<DeleteOutlined />}
                          style={{ 
                            color: '#ff4d4f',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            border: 'none'
                          }}
                        />
                      </Popconfirm>
                    </div>
                  </div>
                }
              >
                <Card.Meta
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
                      {favorite.product.name}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ 
                        color: '#1890ff', 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        marginBottom: 8
                      }}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(favorite.product.price)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Thêm vào: {new Date(favorite.addedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {pagination.totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} của ${total} sản phẩm`
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Favorites;
