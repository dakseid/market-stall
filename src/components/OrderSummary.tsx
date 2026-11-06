import { Link } from "react-router-dom";
import type { CartItem } from "../types";
import { formatNgn, toNaira } from "../lib/currency";

interface OrderSummaryProps {
  items: CartItem[];
  total: number; // in naira
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <aside className="summary summary--sticky" aria-label="Order summary">
      <div className="summary__head">
        <h2>Order summary</h2>
        <Link to="/cart" className="summary__edit">
          Edit cart
        </Link>
      </div>

      <ul className="summary__items">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="summary__item">
            <div className="summary__thumb">
              <img src={product.thumbnail} alt="" width={56} height={56} />
              <span className="summary__qty" aria-hidden="true">
                {quantity}
              </span>
            </div>
            <span className="summary__name">
              {product.title}
              <span className="sr-only"> × {quantity}</span>
            </span>
            <strong>{formatNgn(toNaira(product.price) * quantity)}</strong>
          </li>
        ))}
      </ul>

      <p className="summary__row">
        <span>Subtotal</span>
        <span>{formatNgn(total)}</span>
      </p>
      <p className="summary__row">
        <span>Delivery</span>
        <span className="summary__free">Free</span>
      </p>
      <p className="summary__row summary__total">
        <span>Total</span>
        <strong>{formatNgn(total)}</strong>
      </p>
    </aside>
  );
}