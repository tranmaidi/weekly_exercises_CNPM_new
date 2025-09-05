const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// GET /api/products?categoryId=xxx&page=1&limit=10
router.get("/", async (req, res) => {
  try {
    const { categoryId, page = 1, limit = 10 } = req.query;

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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
