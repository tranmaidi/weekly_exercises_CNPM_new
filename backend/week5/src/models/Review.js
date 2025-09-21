const { Schema, model } = require('mongoose');

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true }, // Chỉ review khi đã mua
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    comment: { type: String, maxlength: 1000 },
    images: [{ type: String }], // URLs của hình ảnh đánh giá
    isVerified: { type: Boolean, default: false }, // Xác thực đã mua hàng
    helpful: { type: Number, default: 0 }, // Số lượt đánh giá hữu ích
    helpfulBy: [{ type: Schema.Types.ObjectId, ref: 'user' }] // Danh sách user đã vote hữu ích
  },
  { timestamps: true }
);

// Index để query nhanh
ReviewSchema.index({ product: 1, rating: -1, createdAt: -1 });
ReviewSchema.index({ user: 1, product: 1 }, { unique: true }); // Mỗi user chỉ review 1 lần/sản phẩm
ReviewSchema.index({ order: 1 });

module.exports = model('Review', ReviewSchema);
