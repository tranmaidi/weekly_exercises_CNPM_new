import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Input, InputNumber, Modal, Row, Select, Space, Table, notification } from "antd";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  searchProductsEsApi
} from "../util/api";
import axios from "../util/axios.customize";
import ProductCard from "../components/ProductCard";

const defaultQuery = { page: 1, limit: 3, sort: "createdAt:desc" };

const ProductsPage = () => {
  const [query, setQuery] = useState(defaultQuery);
  const [data, setData] = useState({ items: [], total: 0, hasNextPage: false, page: 1, limit: defaultQuery.limit });
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/v1/api/categories");
      if (Array.isArray(res)) setCategories(res);
    } catch (_) {
      setCategories([]);
    }
  }

  const fetchProducts = async (params, append = false) => {
    setLoading(true);
    const useEs = !!params.q; // when searching by keyword, use Elasticsearch
    const res = useEs ? await searchProductsEsApi(params) : await getProductsApi(params);
    if (res && !res.message) {
      const next = {
        items: append ? [...data.items, ...res.items] : res.items,
        total: res.total,
        hasNextPage: res.hasNextPage,
        page: res.page,
        limit: res.limit,
      };
      setData(next);
    } else {
      notification.error({ message: "Fetch products", description: res?.message || "Error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price", render: (v) => Intl.NumberFormat().format(v) },
    { title: "Category", dataIndex: ["category", "name"], render: (v) => v || "-" },
    { title: "Views", dataIndex: "views", render: (v) => v || 0 },
    { title: "Sold", dataIndex: "totalSold", render: (v) => v || 0 },
    { title: "Rating", dataIndex: "averageRating", render: (v) => v ? v.toFixed(1) : "-" },
    { title: "Reviews", dataIndex: "totalReviews", render: (v) => v || 0 },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (url) => url ? <Image src={url} width={60} /> : "-"
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const onEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      categoryId: record?.category?._id,
      thumbnail: record.thumbnail,
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    const res = await deleteProductApi(id);
    if (res && res.EC === 0) {
      notification.success({ message: "Delete product", description: "Success" });
      fetchProducts({ ...query, page: 1 });
    } else {
      notification.error({ message: "Delete product", description: res?.EM || "Error" });
    }
  };

  const onFinish = async (values) => {
    const payload = { ...values };
    let res;
    if (editing) {
      res = await updateProductApi(editing._id, payload);
    } else {
      res = await createProductApi(payload);
    }
    if (res && res.EC === 0) {
      notification.success({ message: editing ? "Update product" : "Create product", description: "Success" });
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchProducts({ ...query, page: 1 });
    } else {
      notification.error({ message: "Save product", description: res?.EM || "Error" });
    }
  };

  const onLoadMore = () => {
    if (!data.hasNextPage || loading) return;
    const nextPage = (data.page || 1) + 1;
    const nextQuery = { ...query, page: nextPage };
    setQuery(nextQuery);
    fetchProducts(nextQuery, true);
  };

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
    fetchProducts(params, false);
  }

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="top" style={{ marginBottom: 12, gap: 12 }}>
        <Col><h2>Products</h2></Col>
        <Col flex={1}>
          <Form layout="inline" form={filtersForm} onFinish={applyFilters} style={{ rowGap: 8 }}>
            <Form.Item name="q">
              <Input placeholder="Search name" allowClear />
            </Form.Item>
            <Form.Item name="category">
              <Select placeholder="Category" allowClear style={{ width: 160 }}
                options={categories.map(c => ({ label: c.name, value: c.slug }))}
              />
            </Form.Item>
            <Form.Item name="pricePreset">
              <Select placeholder="Price preset" allowClear style={{ width: 150 }} onChange={onPricePresetChange}
                options={[
                  { label: '0 - 3tr', value: '0-3' },
                  { label: '3 - 10tr', value: '3-10' },
                  { label: '>= 10tr', value: '10+' },
                ]}
              />
            </Form.Item>
            <Form.Item name="priceMin">
              <InputNumber min={0} placeholder="Price min" />
            </Form.Item>
            <Form.Item name="priceMax">
              <InputNumber min={0} placeholder="Price max" />
            </Form.Item>
            <Form.Item name="sort" initialValue={defaultQuery.sort}>
              <Select style={{ width: 180 }}
                options={[
                  { label: 'Newest', value: 'createdAt:desc' },
                  { label: 'Oldest', value: 'createdAt:asc' },
                  { label: 'Price asc', value: 'price:asc' },
                  { label: 'Price desc', value: 'price:desc' },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary">Apply</Button>
                <Button onClick={() => { filtersForm.resetFields(); setQuery(defaultQuery); fetchProducts(defaultQuery, false); }}>Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={onAdd}>Add product</Button>
          </Space>
        </Col>
      </Row>

      {/* Grid View */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {data.items.map((product) => (
          <Col xs={12} sm={8} md={6} lg={4} key={product._id}>
            <ProductCard 
              product={product} 
              onFavoriteChange={(productId, isFavorite) => {
                // Có thể thêm logic cập nhật UI nếu cần
              }}
            />
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Button onClick={onLoadMore} disabled={!data.hasNextPage || loading}>
          {data.hasNextPage ? (loading ? "Loading..." : "Load more") : "No more"}
        </Button>
      </div>

      {/* Table View (Admin) */}
      <div style={{ marginTop: 24 }}>
        <h3>Admin View (Table)</h3>
        <Table
          loading={loading}
          dataSource={data.items}
          columns={columns}
          rowKey={(r) => r._id}
          pagination={false}
        />
      </div>

      <Modal
        title={editing ? "Edit product" : "Create product"}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: "Price is required" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: "Category is required" }]}>
            <Select
              allowClear
              options={categories.map(c => ({ label: c.name, value: c._id }))}
            />
          </Form.Item>
          <Form.Item label="Thumbnail URL" name="thumbnail">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;


