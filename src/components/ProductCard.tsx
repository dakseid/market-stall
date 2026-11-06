import type { Product } from "../types";
import { formatNaira } from "../lib/currency";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock < 1;

  return (
    <li className="card">
      <img
        src={product.thumbnail}
        alt={product.title}
        width={300}
        height={300}
        loading="lazy"
      />
      <div className="card__body">
        <p className="card__category">{product.category}</p>
        <h3 className="card__title">{product.title}</h3>
        <p className="muted">
          ★ {product.rating.toFixed(1)}
          {!outOfStock && product.stock <= 5 && ` · Only ${product.stock} left`}
        </p>
        <div className="card__footer">
          <strong>{formatNaira(product.price)}</strong>
          <Button onClick={() => onAdd(product)} disabled={outOfStock}>
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </li>
  );
}