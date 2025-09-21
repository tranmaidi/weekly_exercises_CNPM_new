const Product = require('../models/Product');

// Lấy sản phẩm tương tự
const getSimilarProducts = async (productId, limit = 8) => {
  try {
    // Lấy thông tin sản phẩm hiện tại
    const currentProduct = await Product.findById(productId)
      .populate('category', 'name slug')
      .lean();

    if (!currentProduct) {
      return { EC: 2, EM: 'Sản phẩm không tồn tại' };
    }

    const { category, price, _id } = currentProduct;
    const priceRange = price * 0.3; // 30% giá trị

    // Tìm sản phẩm tương tự dựa trên:
    // 1. Cùng category
    // 2. Giá trong khoảng ±30%
    // 3. Loại trừ sản phẩm hiện tại
    const similarProducts = await Product.find({
      _id: { $ne: _id },
      category: category._id,
      price: {
        $gte: price - priceRange,
        $lte: price + priceRange
      },
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ averageRating: -1, totalSold: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Nếu không đủ sản phẩm cùng category, lấy thêm từ category khác
    if (similarProducts.length < limit) {
      const remainingLimit = limit - similarProducts.length;
      const excludeIds = [...similarProducts.map(p => p._id), _id];

      const additionalProducts = await Product.find({
        _id: { $nin: excludeIds },
        category: { $ne: category._id },
        isActive: true
      })
        .populate('category', 'name slug')
        .sort({ averageRating: -1, totalSold: -1, createdAt: -1 })
        .limit(remainingLimit)
        .lean();

      similarProducts.push(...additionalProducts);
    }

    return { EC: 0, EM: 'OK', DT: similarProducts };
  } catch (error) {
    console.error('Get similar products error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy sản phẩm được xem nhiều nhất
const getMostViewedProducts = async (limit = 8) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ views: -1, averageRating: -1 })
      .limit(limit)
      .lean();

    return { EC: 0, EM: 'OK', DT: products };
  } catch (error) {
    console.error('Get most viewed products error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy sản phẩm bán chạy nhất
const getBestSellingProducts = async (limit = 8) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ totalSold: -1, averageRating: -1 })
      .limit(limit)
      .lean();

    return { EC: 0, EM: 'OK', DT: products };
  } catch (error) {
    console.error('Get best selling products error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy sản phẩm được đánh giá cao nhất
const getTopRatedProducts = async (limit = 8) => {
  try {
    const products = await Product.find({ 
      isActive: true,
      averageRating: { $gte: 4.0 },
      totalReviews: { $gte: 5 }
    })
      .populate('category', 'name slug')
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(limit)
      .lean();

    return { EC: 0, EM: 'OK', DT: products };
  } catch (error) {
    console.error('Get top rated products error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy sản phẩm mới nhất
const getNewestProducts = async (limit = 8) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return { EC: 0, EM: 'OK', DT: products };
  } catch (error) {
    console.error('Get newest products error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

module.exports = {
  getSimilarProducts,
  getMostViewedProducts,
  getBestSellingProducts,
  getTopRatedProducts,
  getNewestProducts
};
