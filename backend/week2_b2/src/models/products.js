const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [{ type: String }], // mảng chứa link ảnh
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
  },
  { timestamps: true }
);

// Đồng bộ dữ liệu sang Elasticsearch sau khi lưu
productSchema.post("save", async function (doc) {
  try {
    const esClient = require("../config/elasticsearchClient");
    await esClient.index({
      index: "products",
      id: doc._id.toString(),
      document: {
        name: doc.name,
        price: doc.price,
        description: doc.description,
        images: doc.images,
        categoryId: doc.categoryId?.toString(),
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("Elasticsearch index error:", err);
  }
});

module.exports = mongoose.model("Product", productSchema);
