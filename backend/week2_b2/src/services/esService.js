const client = require('../config/elasticsearchClient');

// Indexing a document
async function indexDocument(indexName, document) {
    await client.index({
        index: indexName,
        document: document
    })
}

// Searching for documents
async function searchDocuments(index, query) {
    const { body } = await client.search({
        index,
        body: query,
    });
    return body.hits.hits;
}

async function searchByNameAndPriceandCategory(
    index,
    name,
    minPrice,
    maxPrice,
    categoryId,
    page = 1,
    limit = 10
) {
    const mustQueries = [];

    if (name) {
        mustQueries.push({
            match: {
                name: {
                    query: name,
                    fuzziness: "AUTO",  
                    operator: "and"
                }
            }
        });
    }

    if (categoryId) {
        mustQueries.push({
            term: { categoryId },
        });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        mustQueries.push({
            range: {
                price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                },
            },
        });
    }

    const result = await client.search({
        index,
        from: (page - 1) * limit,
        size: limit,
        query: { bool: { must: mustQueries } },
    });

    return result.hits;
}


module.exports = {
    indexDocument,
    searchDocuments,
    searchByNameAndPriceandCategory,
};