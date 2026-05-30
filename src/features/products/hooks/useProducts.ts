import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/productsApi";

export function useProducts() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return {
    products,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja vörur." : "",
  };
}
