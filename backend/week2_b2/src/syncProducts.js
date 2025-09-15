require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const esClient = require("./config/elasticsearch");
const Product = require("./models/products");
const Category = require("./models/category");


// Kết nối MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Lấy toàn bộ sản phẩm
    const products = await Product.find().populate("categoryId");
    console.log(`📦 Found ${products.length} products`);

    for (const product of products) {
      try {
        await esClient.index({
          index: "products",
          id: product._id.toString(),
          document: {
            name: product.name,
            description: product.description || "",
            price: product.price,
            images: product.images,
            categoryId: product.categoryId?._id?.toString() || null,
            createdAt: product.createdAt,
          },
        });
        console.log(`✅ Indexed product: ${product.name}`);
      } catch (err) {
        console.error(`❌ Failed to index product ${product._id}:`, err);
      }
    }

    console.log("🎉 Sync completed!");
  } catch (error) {
    console.error("❌ Error syncing products:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
