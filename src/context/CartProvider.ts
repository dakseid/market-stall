import { createElement, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { toNaira } from "../lib/currency";
import type { CartItem } from "../types";
import { CartContext, type CartContextValue } from "./CartContext";
import { cartReducer } from "./cartReducer";

const STORAGE_KEY = "market-stall-cart";

// Runs once, on first render, to build the initial state
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return []; // corrupted or blocked storage: start with an empty cart
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  // Save to localStorage every time the cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or disabled: the cart still works, it just won't persist
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      // Derived values: calculated from `items`, never stored in state
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce(
        (sum, i) => sum + toNaira(i.product.price) * i.quantity,
        0
      ),
      add: (product) => dispatch({ type: "ADD", product }),
      increment: (productId) => dispatch({ type: "INCREMENT", productId }),
      decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
      remove: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [items]
  );

  return createElement(CartContext.Provider, { value }, children);
}