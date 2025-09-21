const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    products: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true } // Giá tại thời điểm mua
    }],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], 
      default: 'pending',
      index: true
    },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      district: String
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'credit_card'],
      default: 'cod'
    }
  },
  { timestamps: true }
);

// Index để query nhanh
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = model('Order', OrderSchema);
