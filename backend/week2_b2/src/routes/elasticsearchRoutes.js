const express = require('express');
const router = express.Router();
const elasticsearchService = require('../services/esService');
const { searchByNameAndPriceandCategory } = require('../services/esService');
const client = require('../config/elasticsearchClient');

// Route to index a document
router.post('/index/products', async (req, res) => {
  const { name, price, categoryId, description } = req.body
  const indexName = 'products'

  document = {
    name,
    price,
    categoryId,
    // description,
    createdAt: new Date()
  }

  try {
    await elasticsearchService.indexDocument(indexName, document);
    res.status(200).send('Document indexed successfully');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/search", async (req, res) => {
  try {
    const {
      index = "products",
      name = "",
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const hits = await searchByNameAndPriceandCategory(
      index,
      name,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      categoryId,
      page,
      limit
    );

    const products = hits.hits.map(h => ({
      id: h._id,
      ...h._source,
    }));

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(hits.total.value / parseInt(limit)),
      total: hits.total.value,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// router.put('/create-products-index', async (req, res) => {
//   await client.indices.delete({ index: 'products' });
//   try {
//     const body = {
//       settings: {
//         analysis: {
//           analyzer: {
//             folding_analyzer: {
//               tokenizer: 'standard',
//               filter: ['lowercase', 'asciifolding']
//             }
//           }
//         }
//       },
//       mappings: {
//         properties: {
//           name: {
//             type: 'text',
//             analyzer: 'folding_analyzer',
//             search_analyzer: 'folding_analyzer'
//           },
//           price: { type: 'double' },
//           categoryId: { type: 'keyword' },
//           createdAt: { type: 'date' }
//         }
//       }
//     };

//     const result = await client.indices.create({
//       index: 'products',
//       body
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.meta?.body || err.message });
//   }
// });

module.exports = router;