import React from "react";
import { useCart } from "./CartProvider";
import { CartItem } from "./CartItem";

export const CartList: React.FC = () => {
  const { items } = useCart();

  return (
    <div>
      {items.map(item => (
        <CartItem key={item.id} {...item} />
      ))}
      <div className="mt-4 font-bold">
        Total: ${items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
      </div>
    </div>
  );
};
