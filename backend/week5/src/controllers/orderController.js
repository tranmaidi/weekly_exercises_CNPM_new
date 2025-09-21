const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../services/orderService');

// Tạo đơn hàng mới
const createNewOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;
    
    const result = await createOrder(userId, orderData);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Lấy danh sách đơn hàng của user
const getUserOrdersList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    
    const result = await getUserOrders(userId, page, limit);
    
    if (result.EC === 0) {
      return res.status(200).json(result.DT);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy chi tiết đơn hàng
const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    const result = await getOrderById(orderId, userId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(500).json({ message: result.EM });
    }
  } catch (error) {
    console.error('Get order detail error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { status } = req.body;
    
    const result = await updateOrderStatus(orderId, status, userId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

// Hủy đơn hàng
const cancelUserOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    const result = await cancelOrder(orderId, userId);
    
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 2) {
      return res.status(404).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
  }
};

module.exports = {
  createNewOrder,
  getUserOrdersList,
  getOrderDetail,
  updateOrder,
  cancelUserOrder
};
