const Order = require('../models/Order');
const Product = require('../models/Product');

// Tạo đơn hàng mới
const createOrder = async (userId, orderData) => {
  try {
    const { products, shippingAddress, paymentMethod } = orderData;

    // Kiểm tra sản phẩm tồn tại và tính tổng tiền
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return { EC: 2, EM: `Sản phẩm ${item.productId} không tồn tại` };
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod'
    });

    // Cập nhật tổng số bán của sản phẩm
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, { $inc: { totalSold: item.quantity } });
    }

    return { EC: 0, EM: 'Tạo đơn hàng thành công', DT: order };
  } catch (error) {
    console.error('Create order error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy danh sách đơn hàng của user
const getUserOrders = async (userId, page = 1, limit = 12) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .populate('products.product', 'name thumbnail price')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: userId })
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
        items: orders
      }
    };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('products.product', 'name thumbnail price category')
      .populate('products.product.category', 'name slug')
      .lean();

    if (!order) {
      return { EC: 2, EM: 'Đơn hàng không tồn tại' };
    }

    return { EC: 0, EM: 'OK', DT: order };
  } catch (error) {
    console.error('Get order by id error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (orderId, status, userId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      { status },
      { new: true }
    );

    if (!order) {
      return { EC: 2, EM: 'Đơn hàng không tồn tại' };
    }

    return { EC: 0, EM: 'Cập nhật trạng thái thành công', DT: order };
  } catch (error) {
    console.error('Update order status error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

// Hủy đơn hàng
const cancelOrder = async (orderId, userId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return { EC: 2, EM: 'Không thể hủy đơn hàng này' };
    }

    // Hoàn lại số lượng đã bán
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { totalSold: -item.quantity } });
    }

    return { EC: 0, EM: 'Hủy đơn hàng thành công', DT: order };
  } catch (error) {
    console.error('Cancel order error:', error);
    return { EC: 1, EM: 'Lỗi server' };
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
