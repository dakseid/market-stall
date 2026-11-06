import { createContext } from "react";
import type { CartItem, Product } from "../types";

export interface CartContextValue {
  items: CartItem[];
  count: number; // total number of units, for the cart badge
  total: number; // in naira
  add: (product: Product) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);