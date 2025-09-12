// Các component cơ bản
export * from "./components/Button";
export * from "./components/Input";
export * from "./components/Modal";
export * from "./components/Card";

// Cart system
export * from "./cart/CartProvider";
export * from "./cart/CartItem";
export * from "./cart/CartList";

// ---- Thêm Cart wrapper để dễ import test ----
import { CartProvider } from "./cart/CartProvider";
import { CartList } from "./cart/CartList";

export const Cart = () => {
  return (
    <CartProvider>
      <div style={{ border: "1px solid black", padding: "16px" }}>
        <h2>🛒 My Cart</h2>
        <CartList />
      </div>
    </CartProvider>
  );
};
