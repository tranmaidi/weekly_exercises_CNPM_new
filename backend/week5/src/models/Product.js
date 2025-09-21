const { Schema, model, Types } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    thumbnail: String,
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    promotionPercent: { type: Number, default: 0 }, // 0 = không khuyến mãi
    // Thống kê mới
    totalSold: { type: Number, default: 0 }, // Tổng số đã bán
    totalReviews: { type: Number, default: 0 }, // Tổng số đánh giá
    averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Điểm đánh giá trung bình
    totalFavorites: { type: Number, default: 0 } // Tổng số yêu thích
  },
  { timestamps: true }
);

// Index hữu ích cho sort/loc
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ name: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ views: -1 });
ProductSchema.index({ promotionPercent: -1 });
ProductSchema.index({ totalSold: -1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ totalFavorites: -1 });
module.exports = model('Product', ProductSchema);