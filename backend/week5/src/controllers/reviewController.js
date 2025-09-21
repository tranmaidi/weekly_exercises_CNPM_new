const {
  createReview,
  getProductReviews,
  markHelpful,
  getUserReviews
} = require('../services/reviewService');

// Tạo đánh giá sản phẩm
const createProductReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewData = req.body;
    
    const result = await createReview(userId, reviewData);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Lấy đánh giá của sản phẩm
const getProductReviewsList = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page, limit } = req.query;
    
    const result = await getProductReviews(productId, page, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get product reviews error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đánh giá hữu ích
const markReviewHelpful = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    
    const result = await markHelpful(reviewId, userId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Mark helpful error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Lấy đánh giá của user
const getUserReviewsList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    
    const result = await getUserReviews(userId, page, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get user reviews error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  createProductReview,
  getProductReviewsList,
  markReviewHelpful,
  getUserReviewsList
};
