import type { Product, SortOption } from "../types";

export interface FilterOptions {
  search: string;
  category: string; // a category slug, or "all"
  sort: SortOption;
}

export function filterProducts(
  products: Product[],
  { search, category, sort }: FilterOptions
): Product[] {
  const query = search.trim().toLowerCase();

  // .filter always returns a NEW array, so sorting it below is safe
  const result = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch =
      query === "" ||
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);

  return result;
}