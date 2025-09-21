require('dotenv').config();
const client = require('../config/elasticsearch');

(async () => {
  try {
    const index = 'products';
    await client.indices.create({
      index,
      body: {
        settings: {
          analysis: { analyzer: { vi_simple: { type: 'standard' } } }
        },
        mappings: {
          properties: {
            name: { type: 'text', analyzer: 'standard' },
            description: { type: 'text', analyzer: 'standard' },
            price: { type: 'float' },
            categorySlug: { type: 'keyword' },
            createdAt: { type: 'date' }
          }
        }
      }
    }, { ignore: [400] });
    console.log('ES index ensured:', index);
  } catch (e) {
    console.error('esInit error', e.meta?.body || e);
    process.exit(1);
  }
  process.exit(0);
})();


