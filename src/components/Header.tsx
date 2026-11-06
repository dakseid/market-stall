import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useHideOnScroll } from "../hooks/useHideOnScroll";
import { formatNgn } from "../lib/currency";
import Logo from "./Logo";

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

export default function Header() {
  const { count, total } = useCart();
  const hidden = useHideOnScroll();

  return (
    <header className={`topbar ${hidden ? "topbar--hidden" : ""}`.trim()}>
      <div className="topbar__bar">
        <Link to="/" className="topbar__brand" aria-label="Market Stall, home">
          <Logo size={36} />
          <span className="topbar__name" aria-hidden="true">
            Market<b>Stall</b>
          </span>
        </Link>

        <nav aria-label="Main" className="topbar__nav">
          <NavLink to="/" end className="topbar__link">
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className="topbar__link"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}, total ${formatNgn(total)}`}
          >
            <span className="topbar__icon" aria-hidden="true">
              <BagIcon />
              {count > 0 && (
                <span className="topbar__badge" key={count}>
                  {count}
                </span>
              )}
            </span>
            <span className="topbar__amount" aria-hidden="true">
              {count > 0 ? formatNgn(total) : "Cart"}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}