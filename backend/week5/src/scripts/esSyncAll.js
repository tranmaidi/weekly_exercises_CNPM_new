require('dotenv').config();
const client = require('../config/elasticsearch');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

(async () => {
  try {
    const mongoUri = process.env.MONGO_DB_URL || process.env.MONGO_URL;
    if (!mongoUri) throw new Error('Missing MONGO_DB_URL in .env');
    await mongoose.connect(mongoUri);
    const products = await Product.find().populate('category','slug').lean();

    const operations = [];
    for (const p of products) {
      operations.push({ index: { _index: 'products', _id: String(p._id) } });
      operations.push({
        name: p.name,
        description: '',
        price: p.price,
        categorySlug: p?.category?.slug || '',
        createdAt: p.createdAt
      });
    }

    if (operations.length > 0) {
      const res = await client.bulk({ refresh: true, operations });
      if (res.errors) console.error('Bulk sync had errors', res);
      else console.log('Bulk indexed documents:', products.length);
    } else {
      console.log('No products to index');
    }
  } catch (e) {
    console.error('esSyncAll error', e.meta?.body || e);
    process.exit(1);
  }
  await mongoose.disconnect();
  process.exit(0);
})();


