const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true }
  },
  { timestamps: true, collection: "categories" } 
  // ép Mongoose map đúng với collection "categories"
);

module.exports = mongoose.model("Category", categorySchema);
