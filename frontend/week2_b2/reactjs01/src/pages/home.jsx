import { useEffect, useState } from "react";
import { getProductsApi } from "../util/api";
import "../styles/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await getProductsApi(page, 6); // limit = 6/sp trang

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

  // Lần đầu load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Theo dõi scroll để lazy load
  useEffect(() => {
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
  }, [hasMore, loading]);

  return (
    <div className="home-container">
      <h2>Sản phẩm mới</h2>

      {products.length === 0 && !loading && <p>Chưa có sản phẩm nào.</p>}

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
      {!hasMore && <p>Hết sản phẩm.</p>}
    </div>
  );
};

export default Home;
