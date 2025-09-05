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

const getProductsApi = (page = 1, limit = 10, categoryId = null) => {
  let URL_API = "/v1/api/products?page=${page}&limit=${limit}";
  if (categoryId) URL_API += `&categoryId=${categoryId}`;

  return axios.get(URL_API).then((res) => ({
    products: res?.products || [],
    currentPage: res?.currentPage || page,
    totalPages: res?.totalPages || 1,
    hasMore: res?.hasMore ?? false,
  }));
};

export {
    createUserApi, loginApi, getUserApi, getProductsApi
}