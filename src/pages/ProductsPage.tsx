import { useEffect, useState } from "react";

import { ProductCard } from "../features/products/components/ProductCard";
import { getProducts } from "../features/products/api/productsApi";
import type { Product } from "../features/products/model/product";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsFromApi = await getProducts();
        setProducts(productsFromApi);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return <p className="p-6">Loading products...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">Error: {errorMessage}</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Netverslun
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">Vörur</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Skoðaðu úrval af garni, prjónum, uppskriftum og handavinnuvörum.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-stone-50 p-6 text-stone-600">
          Engar vörur fundust.
        </p>
      ) : (
        <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
