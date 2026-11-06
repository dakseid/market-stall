import { useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import type { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/useCart";
import { filterProducts } from "../lib/filterProducts";
import type { SortOption } from "../types";
import Toolbar from "../components/Toolbar";
import ProductGrid from "../components/ProductGrid";

type ShopPageProps = ReturnType<typeof useProducts>;

export default function ShopPage({
  products,
  categories,
  status,
  error,
  retry,
}: ShopPageProps) {
  const cart = useCart();

  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");

  const search = useDebounce(searchInput, 300);

  const visibleProducts = useMemo(
    () => filterProducts(products, { search, category, sort }),
    [products, search, category, sort]
  );

  const hasActiveFilters = searchInput !== "" || category !== "all";

  function clearFilters() {
    setSearchInput("");
    setCategory("all");
  }

  return (
    <>
      <h1>Products</h1>

      <Toolbar
        search={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        categories={categories}
      />

      <ProductGrid
        products={visibleProducts}
        status={status}
        error={error}
        hasActiveFilters={hasActiveFilters}
        onAdd={cart.add}
        onRetry={retry}
        onClearFilters={clearFilters}
      />
    </>
  );
}