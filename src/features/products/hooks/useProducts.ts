import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/productsApi";
import type { Product } from "../model/product";

export function useProducts(categorySlug?: string) {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products", categorySlug],
    queryFn: () => getProducts(categorySlug),
  });

  return {
    products,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja vörur." : "",
  };
}
