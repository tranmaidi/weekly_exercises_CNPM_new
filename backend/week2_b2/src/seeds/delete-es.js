// src/seeds/clear-products.js
require('dotenv').config();
const esClient = require('../config/elasticsearchClient');

async function clearProducts() {
  try {
    const resp = await esClient.deleteByQuery({
      index: 'products',
      body: {
        query: { match_all: {} }
      },
      refresh: true
    });
    console.log(`✅ Đã xoá ${resp.deleted} documents trong index "products"`);
  } catch (err) {
    console.error('❌ Lỗi xoá document:', err);
  } finally {
    process.exit(0);
  }
}

clearProducts();
