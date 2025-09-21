const {
  addViewHistory,
  getViewHistory,
  clearViewHistory,
  removeFromViewHistory
} = require('../services/viewHistoryService');

// Thêm lịch sử xem sản phẩm
const addView = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const result = await addViewHistory(userId, productId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Add view error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Lấy lịch sử xem sản phẩm
const getViewHistoryList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    
    const result = await getViewHistory(userId, page, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get view history error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa toàn bộ lịch sử xem
const clearAllViews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await clearViewHistory(userId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Clear view history error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa một sản phẩm khỏi lịch sử xem
const removeView = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const result = await removeFromViewHistory(userId, productId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Remove view error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

module.exports = {
  addView,
  getViewHistoryList,
  clearAllViews,
  removeView
};
