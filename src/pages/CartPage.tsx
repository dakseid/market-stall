import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { formatNgn } from "../lib/currency";
import Button from "../components/Button";
import CartItemRow from "../components/CartItemRow";

export default function CartPage() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <Link to="/" className="cart-back">
          <span aria-hidden="true">←</span> Continue shopping
        </Link>
        <div className="cart-empty">
          <div className="cart-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M10 17h28l-2.5 24h-23L10 17Z" />
              <path d="M18 18v-5a6 6 0 0 1 12 0v5" />
              <path d="M19 27h10" />
            </svg>
          </div>
          <p className="cart-eyebrow">YOUR MARKET BAG</p>
          <h1>Your cart is waiting</h1>
          <p className="cart-empty__copy">
            Looks like you haven’t added anything yet. Find something you love
            and it’ll be right here.
          </p>
          <Link to="/" className="btn btn--primary">
            Browse products <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <Link to="/" className="cart-back">
            <span aria-hidden="true">←</span> Continue shopping
          </Link>
          <p className="cart-eyebrow">YOUR MARKET BAG</p>
          <h1>Your cart</h1>
          <p className="cart-heading__copy">
            {cart.count} {cart.count === 1 ? "item" : "items"} from{" "}
            {cart.items.length}{" "}
            {cart.items.length === 1 ? "product" : "products"}
          </p>
        </div>
        <span className="cart-ready">
          <span aria-hidden="true">✓</span> Ready when you are
        </span>
      </div>

      <div className="cart-layout">
        <section className="cart-items-panel" aria-label="Items in your cart">
          <div className="cart-items-panel__head">
            <h2>Your items</h2>
            <span>
              {cart.items.length}{" "}
              {cart.items.length === 1 ? "product" : "products"}
            </span>
          </div>
          <ul className="cart-list">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onIncrement={cart.increment}
                onDecrement={cart.decrement}
                onRemove={cart.remove}
              />
            ))}
          </ul>
          <div className="cart-items-panel__footer">
            <Link to="/" className="cart-continue">
              <span aria-hidden="true">←</span> Keep shopping
            </Link>
            <Button variant="ghost" className="cart-clear" onClick={cart.clear}>
              Clear cart
            </Button>
          </div>
        </section>

        <aside className="summary cart-summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <p className="summary__row">
            <span>
              Subtotal{" "}
              <span className="cart-summary__count">
                ({cart.count} {cart.count === 1 ? "item" : "items"})
              </span>
            </span>
            <span>{formatNgn(cart.total)}</span>
          </p>
          <p className="summary__row">
            <span>Delivery</span>
            <span className="summary__free">Free</span>
          </p>
          <p className="summary__row summary__total">
            <span>Total</span>
            <strong>{formatNgn(cart.total)}</strong>
          </p>
          <Link to="/checkout" className="btn btn--primary cart-checkout">
            Proceed to checkout <span aria-hidden="true">→</span>
          </Link>
          <p className="cart-summary__note">
            <span aria-hidden="true">✦</span> Free delivery on every order
          </p>
        </aside>
      </div>
    </section>
  );
}