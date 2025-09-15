const productService = require("../services/productService");

const createProduct = async (req, res) => {
    try {
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
        }
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
        }
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
        }
        await productService.deleteProduct(req.params.id);
        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.query;
        const results = await productService.searchProducts(keyword);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterProducts = async (req, res) => {
    try {
        const { categoryId, minPrice, maxPrice } = req.query;
        const results = await productService.filterProducts(categoryId, Number(minPrice), Number(maxPrice));
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const result = await productService.getProducts(Number(page), Number(limit));
        return res.status(200).json({
            EC: 0,
            EM: "OK",
            DT: result
        });
    } catch (error) {
        return res.status(500).json({
            EC: 1,
            EM: error.message,
            DT: []
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
