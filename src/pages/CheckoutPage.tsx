import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { formatNgn, toNaira } from "../lib/currency";
import {
  validateCheckout,
  type CheckoutValues,
} from "../lib/validateCheckout";
import type { CartItem } from "../types";
import Button from "../components/Button";
import CheckoutSteps from "../components/CheckoutSteps";
import Input from "../components/Input";
import OrderSummary from "../components/OrderSummary";
import "../styles/checkout.css";

type PaymentMethod = "delivery" | "transfer";

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  icon: string;
  label: string;
  note: string;
}[] = [
  { value: "delivery", icon: "💵", label: "Pay on delivery", note: "Pay when your order arrives." },
  { value: "transfer", icon: "🏦", label: "Bank transfer", note: "Pay by transfer once confirmed." },
];

interface Order {
  reference: string;
  date: string;
  name: string;
  address: string;
  payment: string;
  items: CartItem[]; // a snapshot, because the cart is cleared after ordering
  total: number;
}

const FIELDS = ["name", "phone", "address"] as const;

export default function CheckoutPage() {
  const cart = useCart();

  const [values, setValues] = useState<CheckoutValues>({
    name: "",
    phone: "",
    address: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("delivery");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const timer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Cancel the fake "processing" timer if the user leaves the page
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Move focus to the confirmation heading so screen readers announce the result
  useEffect(() => {
    if (order) headingRef.current?.focus();
  }, [order]);

  // Derived on every render, never stored in state
  const errors = validateCheckout(values);

  const errorFor = (field: keyof CheckoutValues) =>
    touched[field] || submitted ? errors[field] : undefined;

  const isValid = (field: keyof CheckoutValues) =>
    values[field].trim() !== "" && !errors[field];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (placing) return;
    setSubmitted(true);

    const firstInvalid = FIELDS.find((f) => errors[f]);
    if (firstInvalid) {
      const el = e.currentTarget.elements.namedItem(firstInvalid);
      (el as HTMLInputElement | null)?.focus();
      return;
    }

    // Snapshot everything NOW, before the cart is cleared
    const snapshot: Order = {
      reference: "",
      date: "",
      name: values.name.trim(),
      address: values.address.trim(),
      payment: PAYMENT_OPTIONS.find((o) => o.value === payment)!.label,
      items: cart.items,
      total: cart.total,
    };

    setPlacing(true);
    timer.current = window.setTimeout(() => {
      setOrder({
        ...snapshot,
        reference: `MS-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString("en-NG", { dateStyle: "medium" }),
      });
      cart.clear();
      setPlacing(false);
    }, 1200); // pretend to talk to a server
  }

  // 1. Success screen
  if (order) {
    return (
      <>
        <CheckoutSteps current={3} />
        <div className="success">
          <div className="success__check" aria-hidden="true">
            <svg viewBox="0 0 52 52" fill="none">
              <path
                d="M14 27l8 8 16-16"
                stroke="#fff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 ref={headingRef} tabIndex={-1}>
            Thank you, {order.name.split(" ")[0]}!
          </h1>
          <p className="muted">Your order is confirmed. Keep your reference handy.</p>

          <div className="receipt">
            <div className="receipt__top">
              <div>
                <p className="muted">Reference</p>
                <strong className="receipt__ref">{order.reference}</strong>
              </div>
              <div>
                <p className="muted">Date</p>
                <strong>{order.date}</strong>
              </div>
            </div>

            <ul className="receipt__items">
              {order.items.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>
                    {product.title} × {quantity}
                  </span>
                  <span>{formatNgn(toNaira(product.price) * quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="receipt__meta">
              <div>
                <dt>Deliver to</dt>
                <dd>{order.address}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{order.payment}</dd>
              </div>
            </dl>

            <p className="summary__row summary__total">
              <span>Total</span>
              <strong>{formatNgn(order.total)}</strong>
            </p>
          </div>

          <Link to="/" className="btn btn--primary">
            Continue shopping
          </Link>
        </div>
      </>
    );
  }

  // 2. Nothing to check out
  if (cart.items.length === 0) {
    return (
      <div className="state">
        <div className="state__emoji" aria-hidden="true">🧺</div>
        <h1>Your cart is empty</h1>
        <p className="muted">Add something before checking out.</p>
        <Link to="/" className="btn btn--primary">
          Browse products
        </Link>
      </div>
    );
  }

  // 3. The form
  return (
    <>
      <h1>Checkout</h1>
      <CheckoutSteps current={1} />

      <div className="cart-layout">
        <form onSubmit={handleSubmit} noValidate className="form">
          <section className="panel" aria-labelledby="contact-title">
            <h2 id="contact-title" className="panel__title">
              <span className="panel__num" aria-hidden="true">1</span>
              Contact details
            </h2>
            <div className="form-grid">
              <Input
                label="Full name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errorFor("name")}
                valid={isValid("name")}
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0803 123 4567"
                hint="Nigerian number, e.g. 0803 123 4567 or +234 803 123 4567"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errorFor("phone")}
                valid={isValid("phone")}
              />
            </div>
          </section>

          <section className="panel" aria-labelledby="delivery-title">
            <h2 id="delivery-title" className="panel__title">
              <span className="panel__num" aria-hidden="true">2</span>
              Delivery address
            </h2>
            <Input
              label="Address"
              name="address"
              autoComplete="street-address"
              hint="Street, area and city"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor("address")}
              valid={isValid("address")}
            />
          </section>

          <section className="panel" aria-labelledby="payment-title">
            <h2 id="payment-title" className="panel__title">
              <span className="panel__num" aria-hidden="true">3</span>
              Payment method
            </h2>
            <div className="options" role="radiogroup" aria-labelledby="payment-title">
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.value} className="option">
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                  />
                  <span className="option__icon" aria-hidden="true">{opt.icon}</span>
                  <span className="option__text">
                    <strong>{opt.label}</strong>
                    <span className="muted">{opt.note}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <Button
            type="submit"
            className={`btn--lg ${placing ? "is-loading" : ""}`.trim()}
            disabled={placing}
            aria-busy={placing}
          >
            {placing ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Placing order…
              </>
            ) : (
              `Place order · ${formatNgn(cart.total)}`
            )}
          </Button>

          <p className="muted form__note">
            This is a demo checkout. No payment is taken.
          </p>
          <Link to="/cart" className="muted">
            ← Back to cart
          </Link>
        </form>

        <OrderSummary items={cart.items} total={cart.total} />
      </div>
    </>
  );
}