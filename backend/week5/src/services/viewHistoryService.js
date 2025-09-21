const ViewHistory = require('../models/ViewHistory');
const Product = require('../models/Product');

// Thêm lịch sử xem sản phẩm
const addViewHistory = async (userId, productId) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return { EC: 2, EM: 'Sản phẩm không tồn tại' };
    }

    // Tăng view count của sản phẩm
    await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });

    // Thêm vào lịch sử xem (hoặc cập nhật nếu đã có)
    const viewHistory = await ViewHistory.findOneAndUpdate(
      { user: userId, product: productId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    return { EC: 0, EM: 'OK', DT: viewHistory };
  } catch (error) {
    console.error('Add view history error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy lịch sử xem sản phẩm của user
const getViewHistory = async (userId, page = 1, limit = 12) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

    const [viewHistory, total] = await Promise.all([
      ViewHistory.find({ user: userId })
        .populate('product', 'name price thumbnail category totalSold averageRating totalReviews')
        .populate('product.category', 'name slug')
        .sort({ viewedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ViewHistory.countDocuments({ user: userId })
    ]);

    const items = viewHistory.map(view => ({
      _id: view._id,
      product: view.product,
      viewedAt: view.viewedAt
    }));

    return {
      EC: 0,
      EM: 'OK',
      DT: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        items
      }
    };
  } catch (error) {
    console.error('Get view history error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Xóa lịch sử xem
const clearViewHistory = async (userId) => {
  try {
    await ViewHistory.deleteMany({ user: userId });
    return { EC: 0, EM: 'Đã xóa toàn bộ lịch sử xem' };
  } catch (error) {
    console.error('Clear view history error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Xóa một sản phẩm khỏi lịch sử xem
const removeFromViewHistory = async (userId, productId) => {
  try {
    const result = await ViewHistory.findOneAndDelete({ user: userId, product: productId });
    if (!result) {
      return { EC: 2, EM: 'Sản phẩm không có trong lịch sử xem' };
    }
    return { EC: 0, EM: 'Đã xóa khỏi lịch sử xem' };
  } catch (error) {
    console.error('Remove from view history error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

module.exports = {
  addViewHistory,
  getViewHistory,
  clearViewHistory,
  removeFromViewHistory
};
