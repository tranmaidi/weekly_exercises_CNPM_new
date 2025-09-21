import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Space, 
  Button, 
  Card,
  Pagination,
  Spin,
  message
} from "antd";
import {
  getProductsApi,
  searchProductsEsApi
} from "../util/api";
import ProductCard from "../components/ProductCard";

const defaultQuery = { page: 1, limit: 12, sort: "createdAt:desc" };

const UserProducts = () => {
  const [query, setQuery] = useState(defaultQuery);
  const [data, setData] = useState({ items: [], total: 0, hasNextPage: false, page: 1, limit: defaultQuery.limit });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/v1/api/categories');
      const res = await response.json();
      if (Array.isArray(res)) setCategories(res);
    } catch (_) {
      setCategories([]);
    }
  }

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const useEs = !!params.q; // when searching by keyword, use Elasticsearch
      const res = useEs ? await searchProductsEsApi(params) : await getProductsApi(params);
      if (res && !res.message) {
        setData({
          items: res.items || [],
          total: res.total || 0,
          hasNextPage: res.hasNextPage || false,
          page: res.page || 1,
          limit: res.limit || 12,
        });
      } else {
        message.error("Có lỗi xảy ra khi tải sản phẩm");
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      message.error("Có lỗi xảy ra khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(query);
  }, []);

  // search & filters
  const [filtersForm] = Form.useForm();
  
  const onPricePresetChange = (val) => {
    if (!val) {
      filtersForm.setFieldsValue({ priceMin: undefined, priceMax: undefined });
      return;
    }
    if (val === '0-3') {
      filtersForm.setFieldsValue({ priceMin: 0, priceMax: 3000000 });
    } else if (val === '3-10') {
      filtersForm.setFieldsValue({ priceMin: 3000000, priceMax: 10000000 });
    } else if (val === '10+') {
      filtersForm.setFieldsValue({ priceMin: 10000000, priceMax: undefined });
    }
  };

  const applyFilters = () => {
    const values = filtersForm.getFieldsValue();
    const params = {
      ...defaultQuery,
      q: values.q || undefined,
      category: values.category || undefined,
      priceMin: values.priceMin || undefined,
      priceMax: values.priceMax || undefined,
      sort: values.sort || defaultQuery.sort,
    };
    setQuery(params);
    fetchProducts(params);
  }

  const handlePageChange = (page) => {
    const newQuery = { ...query, page };
    setQuery(newQuery);
    fetchProducts(newQuery);
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Sản phẩm</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          Khám phá các sản phẩm chất lượng với giá tốt nhất
        </p>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Form layout="inline" form={filtersForm} onFinish={applyFilters} style={{ rowGap: 8 }}>
          <Form.Item name="q" style={{ minWidth: 200 }}>
            <Input placeholder="Tìm kiếm sản phẩm..." allowClear />
          </Form.Item>
          <Form.Item name="category" style={{ minWidth: 160 }}>
            <Select placeholder="Danh mục" allowClear>
              {categories.map(c => ({ label: c.name, value: c.slug }))}
            </Select>
          </Form.Item>
          <Form.Item name="pricePreset">
            <Select placeholder="Khoảng giá" allowClear style={{ width: 150 }} onChange={onPricePresetChange}
              options={[
                { label: '0 - 3tr', value: '0-3' },
                { label: '3 - 10tr', value: '3-10' },
                { label: '>= 10tr', value: '10+' },
              ]}
            />
          </Form.Item>
          <Form.Item name="priceMin">
            <InputNumber min={0} placeholder="Giá từ" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="priceMax">
            <InputNumber min={0} placeholder="Giá đến" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="sort" initialValue={defaultQuery.sort}>
            <Select style={{ width: 180 }}
              options={[
                { label: 'Mới nhất', value: 'createdAt:desc' },
                { label: 'Cũ nhất', value: 'createdAt:asc' },
                { label: 'Giá tăng dần', value: 'price:asc' },
                { label: 'Giá giảm dần', value: 'price:desc' },
                { label: 'Xem nhiều nhất', value: 'views:desc' },
                { label: 'Bán chạy nhất', value: 'totalSold:desc' },
                { label: 'Đánh giá cao', value: 'averageRating:desc' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary" loading={loading}>
                Tìm kiếm
              </Button>
              <Button onClick={() => { 
                filtersForm.resetFields(); 
                setQuery(defaultQuery); 
                fetchProducts(defaultQuery); 
              }}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Products Grid */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : data.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, color: '#666' }}>
              Hiển thị {data.items.length} sản phẩm trong tổng số {data.total} sản phẩm
            </div>
            
            <Row gutter={[16, 16]}>
              {data.items.map((product) => (
                <Col xs={12} sm={8} md={6} lg={4} key={product._id}>
                  <ProductCard 
                    product={product} 
                    showActions={true}
                    onFavoriteChange={(productId, isFavorite) => {
                      // Có thể thêm logic cập nhật UI nếu cần
                    }}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {data.total > data.limit && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                  current={data.page}
                  total={data.total}
                  pageSize={data.limit}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} của ${total} sản phẩm`
                  }
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProducts;
