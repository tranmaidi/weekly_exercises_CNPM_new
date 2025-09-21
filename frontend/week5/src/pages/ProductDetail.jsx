import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Rate, 
  Tag, 
  Space, 
  message, 
  Tabs, 
  Image, 
  Divider,
  Spin,
  Input,
  Form,
  Modal,
  List,
  Avatar,
  Tooltip
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  ShoppingCartOutlined,
  StarOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProductDetailApi,
  addFavoriteApi,
  removeFavoriteApi,
  checkFavoriteApi,
  getProductReviewsApi,
  createReviewApi,
  getSimilarProductsApi
} from '../util/api';
import { useAuth } from '../components/context/auth.context';
import ProductCard from '../components/ProductCard';

const { TextArea } = Input;
const { TabPane } = Tabs;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchProductDetail();
      fetchReviews();
      fetchSimilarProducts();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await getProductDetailApi(id);
      if (response && response.EC === 0) {
        setProduct(response.DT);
        
        // Kiểm tra favorite status
        if (auth.isAuthenticated) {
          const favoriteResponse = await checkFavoriteApi(id);
          if (favoriteResponse && favoriteResponse.DT !== undefined) {
            setIsFavorite(favoriteResponse.DT);
          }
        }
      } else {
        message.error('Không tìm thấy sản phẩm');
        navigate('/products');
      }
    } catch (error) {
      console.error('Fetch product detail error:', error);
      message.error('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getProductReviewsApi(id, { page: 1, limit: 10 });
      if (response && response.items) {
        setReviews(response.items);
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const response = await getSimilarProductsApi(id, { limit: 4 });
      if (response) {
        setSimilarProducts(response);
      }
    } catch (error) {
      console.error('Fetch similar products error:', error);
    }
  };

  const handleFavorite = async () => {
    if (!auth.isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteApi(id);
        setIsFavorite(false);
        message.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await addFavoriteApi(id);
        setIsFavorite(true);
        message.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      message.error('Có lỗi xảy ra');
    }
  };

  const handleReview = () => {
    if (!auth.isAuthenticated) {
      message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async (values) => {
    try {
      setReviewLoading(true);
      const reviewData = {
        productId: id,
        orderId: 'temp-order-id', // Cần lấy từ đơn hàng thực tế
        rating: values.rating,
        comment: values.comment,
        images: values.images || []
      };
      
      const response = await createReviewApi(reviewData);
      if (response && response.EC === 0) {
        message.success('Đánh giá thành công');
        setReviewModalVisible(false);
        reviewForm.resetFields();
        fetchReviews();
        fetchProductDetail(); // Cập nhật rating trung bình
      } else {
        message.error(response?.EM || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      message.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setReviewLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPromotionPrice = () => {
    if (product?.promotionPercent > 0) {
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
          <div style={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}>
            {promotionPrice}
          </div>
          <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '18px' }}>
            {formatPrice(product.price)}
          </div>
          <Tag color="red" style={{ marginTop: 8, fontSize: '16px' }}>
            -{product.promotionPercent}%
          </Tag>
        </div>
      );
    }
    
    return (
      <div style={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}>
        {formatPrice(product.price)}
      </div>
    );
  };

  const renderStats = () => (
    <div style={{ marginTop: 16 }}>
      <Space size="large">
        <div>
          <EyeOutlined /> {product?.views || 0} lượt xem
        </div>
        <div>
          <HeartOutlined /> {product?.totalFavorites || 0} yêu thích
        </div>
        <div>
          Đã bán: {product?.totalSold || 0}
        </div>
      </Space>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Button type="primary" onClick={() => navigate('/products')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Product Image */}
        <Col xs={24} md={12}>
          <Card>
            <Image
              src={product.thumbnail || '/placeholder-product.jpg'}
              alt={product.name}
              style={{ width: '100%', height: 400, objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <Card>
            <h1 style={{ fontSize: '24px', marginBottom: 16 }}>{product.name}</h1>
            
            {renderPrice()}
            
            {product.averageRating > 0 && (
              <div style={{ marginTop: 16 }}>
                <Rate 
                  disabled 
                  value={product.averageRating} 
                  style={{ fontSize: '18px' }}
                />
                <span style={{ marginLeft: 12, fontSize: '16px' }}>
                  ({product.totalReviews} đánh giá)
                </span>
              </div>
            )}

            {renderStats()}

            <Divider />

            {auth.isAuthenticated ? (
              <>
                <Space size="large" style={{ marginTop: 24 }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => message.info('Tính năng giỏ hàng đang phát triển')}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  
                  <Button
                    size="large"
                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleFavorite}
                    style={{ color: isFavorite ? '#ff4d4f' : undefined }}
                  >
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </Button>
                </Space>

                <div style={{ marginTop: 24 }}>
                  <Button type="link" onClick={handleReview}>
                    <StarOutlined /> Đánh giá sản phẩm
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#666' }}>
                  Đăng nhập để sử dụng các tính năng: yêu thích, đánh giá, mua hàng
                </p>
                <Button type="primary" style={{ marginTop: 12 }} onClick={() => navigate('/login')}>
                  Đăng nhập ngay
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="reviews">
              <TabPane tab="Đánh giá" key="reviews">
                <List
                  dataSource={reviews}
                  renderItem={(review) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <Space>
                            <span>{review.user?.name || 'Khách hàng'}</span>
                            <Rate disabled value={review.rating} />
                            <span style={{ color: '#666' }}>
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </Space>
                        }
                        description={
                          <div>
                            {review.comment && <p>{review.comment}</p>}
                            {review.helpful > 0 && (
                              <div style={{ color: '#666', fontSize: '12px' }}>
                                {review.helpful} người thấy hữu ích
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="Sản phẩm tương tự">
              <Row gutter={[16, 16]}>
                {similarProducts.map((item) => (
                  <Col xs={12} sm={8} md={6} key={item._id}>
                    <ProductCard product={item} showActions={false} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Review Modal */}
      <Modal
        title="Đánh giá sản phẩm"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleReviewSubmit}
        >
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: 'Vui lòng chọn điểm đánh giá' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button onClick={() => setReviewModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={reviewLoading}>
                Gửi đánh giá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductDetail;
