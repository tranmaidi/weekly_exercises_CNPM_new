import { useEffect, useState, useRef } from "react";
import { getProductsApi, searchProductsApi, searchProductSByES } from "../util/api";
import "../styles/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // filters
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ✅ dùng useRef để tránh gọi 2 lần khi StrictMode bật
  const didFetch = useRef(false);

  const fetchProducts = async (pageParam = page) => {
    if (!hasMore || loading || isSearching) return;
    setLoading(true);
    try {
      const res = await getProductsApi(pageParam, 6);
      console.log('ré: ', res)

      const newProducts = res.data.products || [];
      console.log("newProducts: ", newProducts)
      setProducts((prev) =>
        pageParam === 1 ? newProducts : [...prev, ...newProducts]
      );

      setHasMore(res.data.page < res.data.totalPages);
      setPage(pageParam + 1);
    } catch (error) {
      console.error("Lỗi khi load sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim() && !categoryId && !minPrice && !maxPrice) {
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setIsSearching(false);
      fetchProducts(1);
      return;
    }
    try {
      setLoading(true);
      setIsSearching(true);
      const res = await searchProductSByES({
        keyword,
        categoryId,
        minPrice,
        maxPrice,
      });
      console.log("res: ", res.products)
      setProducts(res.products || []);
      setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi search:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("product: ", products)

  // load lần đầu
  useEffect(() => {
    if (!didFetch.current) {
      fetchProducts();
      didFetch.current = true; // ✅ chỉ cho chạy 1 lần
    }
  }, []);

  // lazy load scroll
  useEffect(() => {
    if (isSearching) return;
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
        hasMore &&
        !loading
      ) {
        fetchProducts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, isSearching]);

  return (
    <div className="home-container">
      <h2>Sản phẩm</h2>

      {/* Bộ lọc */}
      <form onSubmit={handleSearch} className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">📂 Tất cả danh mục</option>
          <option value="68be3ca4822c58f3becde046">👕 Áo</option>
          <option value="68be3cc5822c58f3becde048">👟 Giày</option>
        </select>

        <input
          type="number"
          placeholder="⬇️ Giá tối thiểu"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="⬆️ Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="submit">Lọc 🔎</button>
      </form>


      {products.length === 0 && !loading && <p>Không có sản phẩm nào.</p>}

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id || p.id} className="product-card">
            <img
              src={p.images?.[0] || "/no-image.png"}
              alt={p.name || "Sản phẩm"}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">
                {p.price ? `${p.price.toLocaleString("vi-VN")}₫` : "Liên hệ"}
              </p>
              <div className="product-actions">
                <button className="btn">🛒</button>
                <button className="btn">♡</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p>Đang tải...</p>}
      {!hasMore && !isSearching && <p>Hết sản phẩm.</p>}
    </div>
  );
};

export default Home;
