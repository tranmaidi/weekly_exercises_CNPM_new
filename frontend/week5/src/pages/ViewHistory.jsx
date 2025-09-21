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
  Popconfirm,
  Tag
} from 'antd';
import { DeleteOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import { getViewHistoryApi, removeViewApi, clearViewHistoryApi } from '../util/api';
import { useAuth } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ViewHistory = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [viewHistory, setViewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchViewHistory();
    }
  }, [auth.isAuthenticated, pagination.page]);

  const fetchViewHistory = async () => {
    try {
      setLoading(true);
      const response = await getViewHistoryApi({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response) {
        setViewHistory(response.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Fetch view history error:', error);
      message.error('Có lỗi xảy ra khi tải lịch sử xem');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveView = async (productId) => {
    try {
      const response = await removeViewApi(productId);
      if (response && response.EC === 0) {
        message.success('Đã xóa khỏi lịch sử xem');
        setViewHistory(prev => prev.filter(item => item.product._id !== productId));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } else {
        message.error(response?.EM || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Remove view error:', error);
      message.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await clearViewHistoryApi();
      if (response && response.EC === 0) {
        message.success('Đã xóa toàn bộ lịch sử xem');
        setViewHistory([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          page: 1
        }));
      } else {
        message.error(response?.EM || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Clear view history error:', error);
      message.error('Có lỗi xảy ra khi xóa lịch sử');
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const viewedAt = new Date(date);
    const diffInMinutes = Math.floor((now - viewedAt) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xem';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return viewedAt.toLocaleDateString('vi-VN');
  };

  if (!auth.isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Empty
            image={<HistoryOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
            description={
              <div>
                <p style={{ fontSize: '18px', marginBottom: 16 }}>Vui lòng đăng nhập để xem lịch sử xem sản phẩm</p>
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

  if (viewHistory.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Empty
            image={<HistoryOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
            description="Chưa có lịch sử xem sản phẩm nào"
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
            <HistoryOutlined style={{ color: '#1890ff' }} />
            Lịch sử xem sản phẩm ({pagination.total})
          </Space>
        }
        extra={
          <Popconfirm
            title="Xóa toàn bộ lịch sử xem?"
            onConfirm={handleClearAll}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>
              Xóa tất cả
            </Button>
          </Popconfirm>
        }
      >
        <Row gutter={[16, 16]}>
          {viewHistory.map((view) => (
            <Col xs={12} sm={8} md={6} lg={4} key={view._id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={view.product.name}
                      src={view.product.thumbnail || '/placeholder-product.jpg'}
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
                        title="Xóa khỏi lịch sử xem?"
                        onConfirm={() => handleRemoveView(view.product._id)}
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
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8
                    }}>
                      <Tag color="blue" style={{ fontSize: '12px' }}>
                        <EyeOutlined /> {getTimeAgo(view.viewedAt)}
                      </Tag>
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
                      {view.product.name}
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
                        }).format(view.product.price)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Xem lúc: {new Date(view.viewedAt).toLocaleString('vi-VN')}
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

export default ViewHistory;
