const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Fuse = require("fuse.js");

// GET /api/products?categoryId=xxx&page=1&limit=10
router.get("/", async (req, res) => {
  try {
    const { categoryId, page = 1, limit = 3 } = req.query;

    const query = categoryId ? { categoryId } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lấy danh sách sản phẩm
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Đếm tổng số sản phẩm để tính còn dữ liệu không
    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + products.length < total,
    });
  } catch (err) {
    console.error("Error in GET /api/products:", err);
    res.status(500).json({ error: err.message || err.toString() });
  }
});

// API Search dùng Fuse.js
router.get("/search", async (req, res) => {
  try {
    const {
      keyword = "",
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 3,
    } = req.query;

    // Lấy toàn bộ dữ liệu MongoDB (nếu nhiều dữ liệu thì có thể cache sẵn)
    const products = await Product.find();

    // Áp dụng lọc category & price trước (giảm dữ liệu cần fuzzy)
    let filtered = products;

    if (categoryId) {
      filtered = filtered.filter(
        (p) => p.categoryId?.toString() === categoryId
      );
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter((p) => {
        return (
          (!minPrice || p.price >= parseFloat(minPrice)) &&
          (!maxPrice || p.price <= parseFloat(maxPrice))
        );
      });
    }

    let results = filtered;

    // Nếu có keyword thì fuzzy search
    if (keyword) {
      const fuse = new Fuse(filtered, {
        keys: ["name"], // tìm theo tên sản phẩm
        threshold: 0.4, // độ fuzziness (0 = chính xác tuyệt đối, 1 = siêu fuzzy)
      });

      results = fuse.search(keyword).map((r) => r.item);
    }

    // Phân trang
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = results.slice(start, start + parseInt(limit));

    res.json({
      products: paginated,
      currentPage: parseInt(page),
      totalPages: Math.ceil(results.length / parseInt(limit)),
      total: results.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
