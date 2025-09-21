const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  createProductService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  listProductsService,
  listProductsByCategorySlugService,
} = require("../services/productService");
const { addViewHistory } = require("../services/viewHistoryService");
const esClient = require("../config/elasticsearch");
// Lấy danh sách category (simple)
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, "name slug").lean();
    return res.status(200).json(categories);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  const { name, price, categoryId, thumbnail } = req.body;
  const result = await createProductService(name, price, categoryId, thumbnail);
  return res.status(200).json(result);
};

// Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
  const { id } = req.params;
  const result = await getProductByIdService(id);
  
  // Thêm vào lịch sử xem nếu user đã đăng nhập
  if (req.user && result.EC === 0) {
    try {
      await addViewHistory(req.user._id, id);
    } catch (error) {
      console.error('Add view history error:', error);
      // Không ảnh hưởng đến response chính
    }
  }
  
  return res.status(200).json(result);
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateProductService(id, data);
  return res.status(200).json(result);
};

// Xoá sản phẩm
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const result = await deleteProductService(id);
  return res.status(200).json(result);
};

// Lấy danh sách sản phẩm (phân trang + lọc)
const listProducts = async (req, res) => {
  const { page, limit, category, q, sort, priceMin, priceMax, promotionMin, viewsMin, viewsMax, hasPromotion, fuzzy } = req.query;
  const result = await listProductsService(page, limit, category, q, sort, { priceMin, priceMax, promotionMin, viewsMin, viewsMax, hasPromotion, fuzzy });
  if (result.EC === 0) {
    res.json(result.DT);
  } else if (result.EC === 2) {
    res.status(404).json({ message: result.EM });
  } else {
    res.status(500).json({ message: result.EM });
  }
};

// Lấy sản phẩm theo slug category
const listProductsByCategorySlug = async (req, res) => {
  const { slug } = req.params;
  const { page, limit, q, sort, priceMin, priceMax, promotionMin, viewsMin, viewsMax, hasPromotion, fuzzy } = req.query;
  const result = await listProductsByCategorySlugService(slug, page, limit, q, sort, { priceMin, priceMax, promotionMin, viewsMin, viewsMax, hasPromotion, fuzzy });
  if (result.EC === 0) {
    res.json(result.DT);
  } else if (result.EC === 2) {
    res.status(404).json({ message: result.EM });
  } else {
    res.status(500).json({ message: result.EM });
  }
};

// Search via Elasticsearch with fuzziness
const searchProductsEs = async (req, res) => {
  try {
    const { q, category, priceMin, priceMax, page = 1, limit = 12 } = req.query;
    const must = [];
    const should = [];
    if (q) {
      // fuzzy for longer queries
      should.push({ match: { name: { query: q, fuzziness: 'AUTO', operator: 'and' } } });
      // better UX for very short queries: add prefix
      if (String(q).length < 3) {
        should.push({ match_phrase_prefix: { name: { query: q } } });
      }
    }
    const filters = [];
    if (category) filters.push({ term: { categorySlug: category } });
    if (priceMin || priceMax) {
      filters.push({ range: { price: {
        gte: priceMin ? Number(priceMin) : undefined,
        lte: priceMax ? Number(priceMax) : undefined
      } } });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const from = (pageNum - 1) * size;

    const esRes = await esClient.search({
      index: 'products',
      from,
      size,
      query: { bool: { must, should, minimum_should_match: should.length ? 1 : 0, filter: filters } },
      sort: [{ _score: 'desc' }, { createdAt: 'desc' }]
    });

    const total = esRes.hits.total.value;
    const items = esRes.hits.hits.map(h => ({ id: h._id, ...h._source, _score: h._score }));
    return res.json({
      page: pageNum,
      limit: size,
      total,
      totalPages: Math.max(Math.ceil(total / size), 1),
      hasNextPage: from + size < total,
      hasPrevPage: pageNum > 1,
      items
    });
  } catch (e) {
    console.error('ES search error', e.meta?.body || e);
    return res.status(500).json({ message: 'ES search error' });
  }
}
module.exports = {
  listProducts,
  listProductsByCategorySlug,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listCategories,
  searchProductsEs,
};
