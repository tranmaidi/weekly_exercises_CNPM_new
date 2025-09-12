import React from "react";
import { Cart, Button, Input } from "tmd-cart-ui-library";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Test thư viện giỏ hàng</h1>

      {/* Test Cart */}
      <Cart />

      <hr />

      {/* Test Button & Input */}
      <Button onClick={() => alert("Button clicked!")}>
        Nhấn tôi
      </Button>
      <br /><br />
      <Input placeholder="Nhập tên sản phẩm..." />
    </div>
  );
}

export default App;
