const Product = require("../models/products");
const esClient = require("../config/elasticsearchClient");
require("../models/category")

const createProduct = async (data) => {
    const product = new Product(data);
    const saved = await product.save();

    // Index vào Elasticsearch
    await esClient.index({
        index: "products",
        id: saved._id.toString(),
        document: {
            name: saved.name,
            price: saved.price,
            description: saved.description,
            images: saved.images,
            categoryId: saved.categoryId?.toString(),
            createdAt: saved.createdAt,
        },
    });

    return saved;
};


const updateProduct = async (id, data) => {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (product) {
        // update lại trong Elasticsearch
        await esClient.update({
            index: "products",
            id: id.toString(),
            doc: {
                name: product.name,
                price: product.price,
                description: product.description,
                images: product.images,
                categoryId: product.categoryId?.toString(),
                updatedAt: product.updatedAt,
            },
        });
    }
    return product;
};

const deleteProduct = async (id) => {
    await Product.findByIdAndDelete(id);
    await esClient.delete({ index: "products", id: id.toString() }).catch(() => { });
    return true;
};

const searchProducts = async (keyword) => {
    const { hits } = await esClient.search({
        index: "products",
        query: {
            multi_match: {
                query: keyword,
                fields: ["name^3", "description"], // ưu tiên name
                fuzziness: "AUTO"
            },
        },
    });
    return hits.hits.map((hit) => ({ id: hit._id, ...hit._source }));
};


const filterProducts = async (categoryId, minPrice, maxPrice) => {
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice !== undefined && maxPrice !== undefined) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
        filter.price = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
        filter.price = { $lte: maxPrice };
    }
    return await Product.find(filter).populate("categoryId");
};

const getProducts = async (page = 1, limit = 5) => {
    const skip = (page - 1) * limit;
    const products = await Product.find()
        .populate("categoryId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const getProductById = async (id) => {
    return await Product.findById(id).populate("categoryId");
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProducts,
    getProducts,
    getProductById,
};
