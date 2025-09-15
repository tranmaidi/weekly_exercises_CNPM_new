const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');

const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const authorize = require('../middleware/authorize');

const productController = require("../controllers/productController");

const routerAPI = express.Router();

// ==== PUBLIC ROUTES (không cần token) ====
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Public
routerAPI.get("/products", productController.getProducts);
routerAPI.get("/products/:id", productController.getProductById);
routerAPI.get("/products/search", productController.searchProducts);
routerAPI.get("/products/filter", productController.filterProducts);


// ==== PROTECTED ROUTES (cần token) ====
routerAPI.use(auth);  // middleware auth cho tất cả route dưới đây

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// ==== PRODUCT ROUTES ====
// Admin required
routerAPI.post("/products", authorize(["Admin"]), productController.createProduct);
routerAPI.put("/products/:id", authorize(["Admin"]), productController.updateProduct);
routerAPI.delete("/products/:id", authorize(["Admin"]), productController.deleteProduct);

module.exports = routerAPI; //export default
