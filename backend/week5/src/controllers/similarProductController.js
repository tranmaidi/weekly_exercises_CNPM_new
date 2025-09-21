const {
  getSimilarProducts,
  getMostViewedProducts,
  getBestSellingProducts,
  getTopRatedProducts,
  getNewestProducts
} = require('../services/similarProductService');

// Lấy sản phẩm tương tự
const getSimilar = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit } = req.query;
    
    const result = await getSimilarProducts(productId, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get similar products error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy sản phẩm được xem nhiều nhất
const getMostViewed = async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await getMostViewedProducts(limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get most viewed products error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy sản phẩm bán chạy nhất
const getBestSelling = async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await getBestSellingProducts(limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get best selling products error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy sản phẩm được đánh giá cao nhất
const getTopRated = async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await getTopRatedProducts(limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get top rated products error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy sản phẩm mới nhất
const getNewest = async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await getNewestProducts(limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get newest products error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getSimilar,
  getMostViewed,
  getBestSelling,
  getTopRated,
  getNewest
};
