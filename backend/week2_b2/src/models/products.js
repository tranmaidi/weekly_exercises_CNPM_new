const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }], // mảng chứa link ảnh
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
  },
  { timestamps: true }
);
productSchema.post("save", async function (doc) {
  const esClient = require("../config/elasticsearch");
  await esClient.index({
    index: "products",
    id: doc._id.toString(),
    document: {
      name: doc.name,
      price: doc.price,
      images: doc.images,
      categoryId: doc.categoryId?.toString(),
      createdAt: doc.createdAt,
    },
  });
});

module.exports = mongoose.model("Product", productSchema);
