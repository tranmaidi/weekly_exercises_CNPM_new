const { Schema, model } = require('mongoose');

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true }
  },
  { timestamps: true }
);

// Tạo compound index để tránh duplicate
FavoriteSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model('Favorite', FavoriteSchema);
