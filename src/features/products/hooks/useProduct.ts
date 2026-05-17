import { useEffect, useState } from "react";
import { getProductById } from "../api/productsApi";
import type { Product } from "../model/product";

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) return;

        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setErrorMessage("Ekki tókst að sækja vöruna.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return {
    product,
    isLoading,
    errorMessage,
  };
}
