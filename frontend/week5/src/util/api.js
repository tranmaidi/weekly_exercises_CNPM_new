import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name, email, password
  }

  return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email, password
  }

  return axios.post(URL_API, data)
}

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API)
}

// Products
const getProductsApi = (params = {}) => {
  const URL_API = "/v1/api/products";
  return axios.get(URL_API, { params });
}

const getProductsByCategorySlugApi = (slug, params = {}) => {
  const URL_API = `/v1/api/categories/${slug}/products`;
  return axios.get(URL_API, { params });
}

const getProductDetailApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.get(URL_API);
}

const createProductApi = (payload) => {
  const URL_API = "/v1/api/products";
  return axios.post(URL_API, payload);
}

const updateProductApi = (id, payload) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.put(URL_API, payload);
}

const deleteProductApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.delete(URL_API);
}

// Elasticsearch search
const searchProductsEsApi = (params = {}) => {
  const URL_API = `/v1/api/search/products`;
  return axios.get(URL_API, { params });
}

// Favorites
const addFavoriteApi = (productId) => {
  const URL_API = `/v1/api/favorites/${productId}`;
  return axios.post(URL_API);
}

const removeFavoriteApi = (productId) => {
  const URL_API = `/v1/api/favorites/${productId}`;
  return axios.delete(URL_API);
}

const getFavoritesApi = (params = {}) => {
  const URL_API = `/v1/api/favorites`;
  return axios.get(URL_API, { params });
}

const checkFavoriteApi = (productId) => {
  const URL_API = `/v1/api/favorites/${productId}/check`;
  return axios.get(URL_API);
}

// View History
const addViewApi = (productId) => {
  const URL_API = `/v1/api/views/${productId}`;
  return axios.post(URL_API);
}

const getViewHistoryApi = (params = {}) => {
  const URL_API = `/v1/api/views`;
  return axios.get(URL_API, { params });
}

const clearViewHistoryApi = () => {
  const URL_API = `/v1/api/views`;
  return axios.delete(URL_API);
}

const removeViewApi = (productId) => {
  const URL_API = `/v1/api/views/${productId}`;
  return axios.delete(URL_API);
}

// Orders
const createOrderApi = (orderData) => {
  const URL_API = `/v1/api/orders`;
  return axios.post(URL_API, orderData);
}

const getUserOrdersApi = (params = {}) => {
  const URL_API = `/v1/api/orders`;
  return axios.get(URL_API, { params });
}

const getOrderDetailApi = (orderId) => {
  const URL_API = `/v1/api/orders/${orderId}`;
  return axios.get(URL_API);
}

const updateOrderApi = (orderId, status) => {
  const URL_API = `/v1/api/orders/${orderId}`;
  return axios.put(URL_API, { status });
}

const cancelOrderApi = (orderId) => {
  const URL_API = `/v1/api/orders/${orderId}`;
  return axios.delete(URL_API);
}

// Reviews
const createReviewApi = (reviewData) => {
  const URL_API = `/v1/api/reviews`;
  return axios.post(URL_API, reviewData);
}

const getProductReviewsApi = (productId, params = {}) => {
  const URL_API = `/v1/api/products/${productId}/reviews`;
  return axios.get(URL_API, { params });
}

const markReviewHelpfulApi = (reviewId) => {
  const URL_API = `/v1/api/reviews/${reviewId}/helpful`;
  return axios.post(URL_API);
}

const getUserReviewsApi = (params = {}) => {
  const URL_API = `/v1/api/reviews/my`;
  return axios.get(URL_API, { params });
}

// Similar Products
const getSimilarProductsApi = (productId, params = {}) => {
  const URL_API = `/v1/api/products/${productId}/similar`;
  return axios.get(URL_API, { params });
}

const getMostViewedProductsApi = (params = {}) => {
  const URL_API = `/v1/api/products/most-viewed`;
  return axios.get(URL_API, { params });
}

const getBestSellingProductsApi = (params = {}) => {
  const URL_API = `/v1/api/products/best-selling`;
  return axios.get(URL_API, { params });
}

const getTopRatedProductsApi = (params = {}) => {
  const URL_API = `/v1/api/products/top-rated`;
  return axios.get(URL_API, { params });
}

const getNewestProductsApi = (params = {}) => {
  const URL_API = `/v1/api/products/newest`;
  return axios.get(URL_API, { params });
}

export {
  createUserApi, loginApi, getUserApi,
  getProductsApi, getProductsByCategorySlugApi, getProductDetailApi,
  createProductApi, updateProductApi, deleteProductApi,
  searchProductsEsApi,
  addFavoriteApi, removeFavoriteApi, getFavoritesApi, checkFavoriteApi,
  addViewApi, getViewHistoryApi, clearViewHistoryApi, removeViewApi,
  createOrderApi, getUserOrdersApi, getOrderDetailApi, updateOrderApi, cancelOrderApi,
  createReviewApi, getProductReviewsApi, markReviewHelpfulApi, getUserReviewsApi,
  getSimilarProductsApi, getMostViewedProductsApi, getBestSellingProductsApi, 
  getTopRatedProductsApi, getNewestProductsApi
}
