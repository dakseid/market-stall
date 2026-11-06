export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

export interface Category {
    slug: string;
    name: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type Status = "loading" | "success" | "error";
export type SortOption = "default" | "price-asc" | "price-desc";