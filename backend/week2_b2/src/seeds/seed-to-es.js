require('dotenv').config()
const mongoose = require('mongoose')
const connection = require('../config/database')   // ✅ nếu dùng Cách A
const Product = require('../models/products')
const esClient = require('../config/elasticsearchClient')

async function seedProductsToElasticsearch() {
  try {
    await connection()   // Kết nối MongoDB
    console.log('✅ MongoDB connected')

    const products = await Product.find({})
    console.log(`Found ${products.length} products from MongoDB`)

    if (products.length === 0) {
      console.log('No products found.')
      return
    }

    const indexName = 'products'
    const exists = await esClient.indices.exists({ index: indexName })

    if (!exists) {
      await esClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              price: { type: 'double' },
              categoryId: { type: 'keyword' },
            }
          }
        }
      })
      console.log(`Created index ${indexName}`)
    }

    const bulkOps = []
    products.forEach(p => {
      bulkOps.push({ index: { _index: indexName, _id: p._id.toString() } })
      bulkOps.push({
        name: p.name,
        price: p.price,
        images: p.images,
        categoryId: p.categoryId?.toString(),
        createdAt: p.createdAt,
      })
    })

    const bulkResponse = await esClient.bulk({
      refresh: true,
      operations: bulkOps
    })

    if (bulkResponse.errors) {
      console.error('Bulk import had errors', bulkResponse)
    } else {
      console.log(`Imported ${products.length} products into Elasticsearch`)
    }
  } catch (err) {
    console.error('Error seeding products:', err)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seedProductsToElasticsearch()
