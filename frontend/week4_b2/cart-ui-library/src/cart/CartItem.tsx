import React from "react";
import { Button } from "../components/Button";
import { useCart } from "./CartProvider";

type Props = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export const CartItem: React.FC<Props> = ({ id, name, price, quantity }) => {
  const { updateItem, removeItem } = useCart();

  return (
    <div className="flex justify-between items-center border-b py-2">
      <span>{name} (${price})</span>
      <div>
        <input
          type="number"
          value={quantity}
          onChange={e => updateItem(id, parseInt(e.target.value))}
          className="w-16 text-center border rounded"
        />
        <Button variant="danger" onClick={() => removeItem(id)}>Remove</Button>
      </div>
    </div>
  );
};
