import { useEffect, useState } from "react";

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
    return <p>Loading products...</p>;
  }

  if (errorMessage) {
    return <p>Error: {errorMessage}</p>;
  }

  return (
    <main>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price} kr.</p>
              <p>Category: {product.categories.name}</p>
              <p>Stock: {product.stock}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
