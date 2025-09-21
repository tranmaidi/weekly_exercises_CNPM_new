const { Schema, model } = require('mongoose');

const ViewHistorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    viewedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

// Index để query nhanh
ViewHistorySchema.index({ user: 1, viewedAt: -1 });
ViewHistorySchema.index({ product: 1, viewedAt: -1 });

module.exports = model('ViewHistory', ViewHistorySchema);
