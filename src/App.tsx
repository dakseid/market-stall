import { Route, Routes } from "react-router-dom";
import { useProducts } from "./hooks/useProducts";
import Header from "./components/Header";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  // Fetched once here, so it survives navigating between pages
  const productsState = useProducts();

  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<ShopPage {...productsState} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}