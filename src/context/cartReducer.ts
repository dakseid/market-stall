import type { CartItem, Product } from "../types";

export type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "INCREMENT"; productId: number }
  | { type: "DECREMENT"; productId: number }
  | { type: "REMOVE"; productId: number }
  | { type: "CLEAR" };

// Change one item's quantity by `delta`, respecting stock.
// Items that drop to 0 are removed from the cart.
function changeQuantity(
  state: CartItem[],
  productId: number,
  delta: number
): CartItem[] {
  return state
    .map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity: Math.min(item.quantity + delta, item.product.stock),
          }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      if (action.product.stock < 1) return state; // out of stock, ignore
      const exists = state.some((i) => i.product.id === action.product.id);
      if (exists) return changeQuantity(state, action.product.id, 1);
      return [...state, { product: action.product, quantity: 1 }];
    }
    case "INCREMENT":
      return changeQuantity(state, action.productId, 1);
    case "DECREMENT":
      return changeQuantity(state, action.productId, -1);
    case "REMOVE":
      return state.filter((i) => i.product.id !== action.productId);
    case "CLEAR":
      return [];
  }
}