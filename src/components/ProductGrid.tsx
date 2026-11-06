import type { Product, Status } from "../types";
import Button from "./Button";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  status: Status;
  error: string | null;
  hasActiveFilters: boolean;
  onAdd: (product: Product) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export default function ProductGrid({
  products,
  status,
  error,
  hasActiveFilters,
  onAdd,
  onRetry,
  onClearFilters,
}: ProductGridProps) {
  if (status === "loading") {
    return (
      <div role="status" aria-label="Loading products">
        <ul className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="card skeleton" aria-hidden="true" />
          ))}
        </ul>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="state" role="alert">
        <h2>We couldn't load the products</h2>
        <p className="muted">{error}</p>
        <Button onClick={onRetry}>Try again</Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="state">
        <h2>No products found</h2>
        <p className="muted">Try a different search or category.</p>
        {hasActiveFilters && (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </ul>
  );
}