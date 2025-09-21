import { CrownOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Result, Space, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/context/auth.context';

const HomePage = () => {
  const { auth } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="Chào mừng đến với cửa hàng trực tuyến"
        subTitle="Khám phá các sản phẩm chất lượng với giá tốt nhất"
        extra={
          <Space>
            <Link to="/products">
              <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                Xem sản phẩm
              </Button>
            </Link>
            {!auth.isAuthenticated && (
              <Link to="/login">
                <Button size="large">Đăng nhập</Button>
              </Link>
            )}
          </Space>
        }
      />
      
      {auth.isAuthenticated && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
            Chào mừng {auth.user?.name || auth.user?.email}!
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ height: '100%' }}>
                <Card.Meta
                  title="Sản phẩm yêu thích"
                  description="Xem danh sách sản phẩm bạn đã yêu thích"
                  extra={<Link to="/favorites"><Button type="primary">Xem ngay</Button></Link>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ height: '100%' }}>
                <Card.Meta
                  title="Lịch sử xem"
                  description="Xem lại các sản phẩm bạn đã xem"
                  extra={<Link to="/view-history"><Button type="primary">Xem ngay</Button></Link>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ height: '100%' }}>
                <Card.Meta
                  title="Quản lý hệ thống"
                  description="Quản lý sản phẩm và người dùng"
                  extra={<Link to="/admin/products"><Button type="primary">Vào admin</Button></Link>}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default HomePage;
