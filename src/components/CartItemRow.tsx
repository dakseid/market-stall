import type { CartItem } from "../types";
import { formatNaira, formatNgn, toNaira } from "../lib/currency";
import Button from "./Button";

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item;
  const atStockLimit = quantity >= product.stock;

  return (
    <li className="cart-row">
      <img
        className="cart-row__image"
        src={product.thumbnail}
        alt=""
        width={88}
        height={88}
      />

      <div className="cart-row__info">
        <p className="cart-row__title">{product.title}</p>
        <p className="cart-row__unit">{formatNaira(product.price)} each</p>

        <div className="qty" role="group" aria-label={`Quantity for ${product.title}`}>
          <Button
            variant="secondary"
            aria-label={`Decrease quantity of ${product.title}`}
            onClick={() => onDecrement(product.id)}
          >
            −
          </Button>
          <span aria-live="polite">{quantity}</span>
          <Button
            variant="secondary"
            aria-label={`Increase quantity of ${product.title}`}
            onClick={() => onIncrement(product.id)}
            disabled={atStockLimit}
          >
            +
          </Button>
          {atStockLimit && (
            <span className="cart-row__stock-note">Max available</span>
          )}
        </div>
      </div>

      <div className="cart-row__side">
        <strong className="cart-row__total">
          {formatNgn(toNaira(product.price) * quantity)}
        </strong>
        <Button
          variant="ghost"
          className="cart-row__remove"
          aria-label={`Remove ${product.title} from cart`}
          onClick={() => onRemove(product.id)}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}