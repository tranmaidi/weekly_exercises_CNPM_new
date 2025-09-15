import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  return axios.post(URL_API, { name, email, password });
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  return axios.post(URL_API, { email, password });
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

const getProductsApi = async (page = 1, limit = 5) => {
  try {
    const URL_API = `/v1/api/products?page=${page}&limit=${limit}`;
    const res = (await axios.get(URL_API));
    console.log("ss: ", res)

    // backend đã chuẩn hóa trả về { EC, EM, DT }
    if (res.DT && res.EC === 0) {
      return {
        success: true,
        message: res.EM,
        data: res.DT, 
      };
    } else {
      return {
        success: false,
        message: res.EM || "Có lỗi xảy ra",
        data: null,
      };
    }
  } catch (err) {
    console.error("getProductsApi error:", err);
    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
};

const searchProductsApi = ({ keyword = "", categoryId, minPrice, maxPrice }) => {
  let URL_API = `/v1/api/products/search?keyword=${encodeURIComponent(keyword)}`;
  if (categoryId) URL_API += `&categoryId=${categoryId}`;
  if (minPrice) URL_API += `&minPrice=${minPrice}`;
  if (maxPrice) URL_API += `&maxPrice=${maxPrice}`;

  return axios.get(URL_API).then((res) => {
    const data = res.data;
    return {
      products: data || [],
      total: data?.length || 0,
    };
  });
};

const searchProductSByES = ({ keyword = "", categoryId, minPrice, maxPrice }) => {
    let URL_API = `/v1/api/elasticsearch/search?`;

    // URL_API += `index=products`;
    if (keyword.trim()) URL_API += `&name=${encodeURIComponent(keyword.trim())}`;
    if (categoryId?.toString().trim()) URL_API += `&categoryId=${categoryId}`;
    if (minPrice?.toString().trim()) URL_API += `&minPrice=${minPrice}`;
    if (maxPrice?.toString().trim()) URL_API += `&maxPrice=${maxPrice}`;

    console.log("URL_API:", URL_API); 

    return axios.get(URL_API).then((res) => ({
        products: res?.products || [],
        total: res?.total || 0,
    }));
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  getProductsApi,
  searchProductsApi,
  searchProductSByES,
};
