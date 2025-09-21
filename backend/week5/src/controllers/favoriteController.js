const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite
} = require('../services/favoriteService');

// Thêm sản phẩm vào yêu thích
const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const result = await addToFavorites(userId, productId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Add favorite error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Xóa sản phẩm khỏi yêu thích
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const result = await removeFromFavorites(userId, productId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Remove favorite error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoritesList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    
    const result = await getFavorites(userId, page, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Kiểm tra sản phẩm có trong yêu thích không
const checkFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const result = await isFavorite(userId, productId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Check favorite error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesList,
  checkFavorite
};
