const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// Thêm sản phẩm vào yêu thích
const addToFavorites = async (userId, productId) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return { EC: 2, EM: 'Sản phẩm không tồn tại' };
    }

    // Kiểm tra đã yêu thích chưa
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return { EC: 1, EM: 'Sản phẩm đã có trong danh sách yêu thích' };
    }

    // Thêm vào yêu thích
    const favorite = await Favorite.create({ user: userId, product: productId });

    // Cập nhật tổng số yêu thích của sản phẩm
    await Product.findByIdAndUpdate(productId, { $inc: { totalFavorites: 1 } });

    return { EC: 0, EM: 'Đã thêm vào danh sách yêu thích', DT: favorite };
  } catch (error) {
    console.error('Add to favorites error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Xóa sản phẩm khỏi yêu thích
const removeFromFavorites = async (userId, productId) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
    if (!favorite) {
      return { EC: 2, EM: 'Sản phẩm không có trong danh sách yêu thích' };
    }

    // Cập nhật tổng số yêu thích của sản phẩm
    await Product.findByIdAndUpdate(productId, { $inc: { totalFavorites: -1 } });

    return { EC: 0, EM: 'Đã xóa khỏi danh sách yêu thích' };
  } catch (error) {
    console.error('Remove from favorites error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy danh sách sản phẩm yêu thích
const getFavorites = async (userId, page = 1, limit = 12) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

    const [favorites, total] = await Promise.all([
      Favorite.find({ user: userId })
        .populate('product', 'name price thumbnail category totalSold averageRating totalReviews')
        .populate('product.category', 'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Favorite.countDocuments({ user: userId })
    ]);

    const items = favorites.map(fav => ({
      _id: fav._id,
      product: fav.product,
      addedAt: fav.createdAt
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
    console.error('Get favorites error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Kiểm tra sản phẩm có trong yêu thích không
const isFavorite = async (userId, productId) => {
  try {
    const favorite = await Favorite.findOne({ user: userId, product: productId });
    return { EC: 0, EM: 'OK', DT: !!favorite };
  } catch (error) {
    console.error('Check favorite error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite
};
