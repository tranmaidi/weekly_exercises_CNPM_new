const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { listProducts, listProductsByCategorySlug,createProduct, getProductById, updateProduct, deleteProduct, listCategories, searchProductsEs } = require("../controllers/productController");
const { addFavorite, removeFavorite, getFavoritesList, checkFavorite } = require('../controllers/favoriteController');
const { addView, getViewHistoryList, clearAllViews, removeView } = require('../controllers/viewHistoryController');
const { createNewOrder, getUserOrdersList, getOrderDetail, updateOrder, cancelUserOrder } = require('../controllers/orderController');
const { createProductReview, getProductReviewsList, markReviewHelpful, getUserReviewsList } = require('../controllers/reviewController');
const { getSimilar, getMostViewed, getBestSelling, getTopRated, getNewest } = require('../controllers/similarProductController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});
routerAPI.get("/products", listProducts); // GET /api/products
routerAPI.get("/categories/:slug/products", listProductsByCategorySlug); // GET /api/categories/:slug/products
routerAPI.get("/categories", listCategories); // GET /api/categories
routerAPI.get("/search/products", searchProductsEs); // GET /api/search/products
routerAPI.get("/products/:id", getProductById); // GET /api/products/:id
routerAPI.post("/products", createProduct); // POST /api/products
routerAPI.post("/addProduct", createProduct); // legacy route: POST /api/addProduct
routerAPI.put("/products/:id", updateProduct); // PUT /api/products/:id
routerAPI.delete("/products/:id", deleteProduct); // DELETE /api/products/:id
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Favorites routes
routerAPI.post("/favorites/:productId", addFavorite);
routerAPI.delete("/favorites/:productId", removeFavorite);
routerAPI.get("/favorites", getFavoritesList);
routerAPI.get("/favorites/:productId/check", checkFavorite);

// View History routes
routerAPI.post("/views/:productId", addView);
routerAPI.get("/views", getViewHistoryList);
routerAPI.delete("/views", clearAllViews);
routerAPI.delete("/views/:productId", removeView);

// Orders routes
routerAPI.post("/orders", createNewOrder);
routerAPI.get("/orders", getUserOrdersList);
routerAPI.get("/orders/:orderId", getOrderDetail);
routerAPI.put("/orders/:orderId", updateOrder);
routerAPI.delete("/orders/:orderId", cancelUserOrder);

// Reviews routes
routerAPI.post("/reviews", createProductReview);
routerAPI.get("/products/:productId/reviews", getProductReviewsList);
routerAPI.post("/reviews/:reviewId/helpful", markReviewHelpful);
routerAPI.get("/reviews/my", getUserReviewsList);

// Similar Products routes
routerAPI.get("/products/:productId/similar", getSimilar);
routerAPI.get("/products/most-viewed", getMostViewed);
routerAPI.get("/products/best-selling", getBestSelling);
routerAPI.get("/products/top-rated", getTopRated);
routerAPI.get("/products/newest", getNewest);

module.exports = routerAPI; // export default
