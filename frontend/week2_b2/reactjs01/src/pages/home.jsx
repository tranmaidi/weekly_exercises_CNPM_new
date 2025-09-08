import { useEffect, useState } from "react";
import { getProductsApi, searchProductsApi } from "../util/api";
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

  const fetchProducts = async () => {
    if (!hasMore || loading || isSearching) return;
    setLoading(true);
    try {
      const res = await getProductsApi(page, 6);
      if (res?.products) {
        setProducts((prev) => [...prev, ...res.products]);
        setHasMore(res.hasMore);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Lỗi khi load sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim() && !categoryId && !minPrice && !maxPrice) {
      // reset -> quay về lazy load
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setIsSearching(false);
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      setIsSearching(true);
      const res = await searchProductsApi({
        keyword,
        categoryId,
        minPrice,
        maxPrice,
      });
      setProducts(res?.products || []);
      setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi search:", err);
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu
  useEffect(() => {
    fetchProducts();
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
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          <option value="id_danh_muc_1">Áo</option>
          <option value="id_danh_muc_2">Quần</option>
          <option value="id_danh_muc_3">Giày</option>
          {/* TODO: load category từ API thay vì fix cứng */}
        </select>

        <input
          type="number"
          placeholder="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="submit">Lọc</button>
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
                {p.price
                  ? `${p.price.toLocaleString("vi-VN")}₫`
                  : "Liên hệ"}
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
