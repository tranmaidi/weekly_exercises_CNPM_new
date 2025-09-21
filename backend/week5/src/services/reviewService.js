const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Tạo đánh giá sản phẩm
const createReview = async (userId, reviewData) => {
  try {
    const { productId, orderId, rating, comment, images } = reviewData;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return { EC: 2, EM: 'Sản phẩm không tồn tại' };
    }

    // Kiểm tra đơn hàng thuộc về user và có chứa sản phẩm này
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      'products.product': productId,
      status: 'delivered'
    });

    if (!order) {
      return { EC: 2, EM: 'Bạn chưa mua sản phẩm này hoặc đơn hàng chưa được giao' };
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return { EC: 1, EM: 'Bạn đã đánh giá sản phẩm này rồi' };
    }

    // Tạo đánh giá
    const review = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
      images: images || [],
      isVerified: true
    });

    // Cập nhật thống kê sản phẩm
    await updateProductReviewStats(productId);

    return { EC: 0, EM: 'Đánh giá thành công', DT: review };
  } catch (error) {
    console.error('Create review error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy đánh giá của sản phẩm
const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments({ product: productId })
    ]);

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
        items: reviews
      }
    };
  } catch (error) {
    console.error('Get product reviews error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Đánh giá hữu ích
const markHelpful = async (reviewId, userId) => {
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return { EC: 2, EM: 'Đánh giá không tồn tại' };
    }

    // Kiểm tra đã vote chưa
    if (review.helpfulBy.includes(userId)) {
      return { EC: 1, EM: 'Bạn đã đánh giá hữu ích rồi' };
    }

    // Thêm vote
    await Review.findByIdAndUpdate(reviewId, {
      $inc: { helpful: 1 },
      $push: { helpfulBy: userId }
    });

    return { EC: 0, EM: 'Đánh giá hữu ích' };
  } catch (error) {
    console.error('Mark helpful error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Cập nhật thống kê đánh giá sản phẩm
const updateProductReviewStats = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        totalReviews: stats[0].totalReviews,
        averageRating: Math.round(stats[0].averageRating * 10) / 10
      });
    }
  } catch (error) {
    console.error('Update product review stats error:', error);
  }
};

// Lấy đánh giá của user
const getUserReviews = async (userId, page = 1, limit = 10) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const [reviews, total] = await Promise.all([
      Review.find({ user: userId })
        .populate('product', 'name thumbnail price')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments({ user: userId })
    ]);

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
        items: reviews
      }
    };
  } catch (error) {
    console.error('Get user reviews error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

module.exports = {
  createReview,
  getProductReviews,
  markHelpful,
  updateProductReviewStats,
  getUserReviews
};
