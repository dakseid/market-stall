import { useCallback, useEffect, useState } from "react";
import type { Category, Product, Status } from "../types";

const BASE_URL = "https://dummyjson.com";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${BASE_URL}/products?limit=0`, { signal }),
          fetch(`${BASE_URL}/products/categories`, { signal }),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("The server responded with an error.");
        }

        const productsData = await productsRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setProducts(productsData.products);
        setCategories(categoriesData);
        setStatus("success");
      } catch (err) {
        if (signal.aborted) return; // component unmounted, ignore
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    }

    load();
    return () => controller.abort(); // cleanup
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { products, categories, status, error, retry };
}