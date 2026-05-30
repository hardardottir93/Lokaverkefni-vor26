import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../api/productsApi";

export function useProduct(id: string | undefined) {
  const {
    data: product = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });

  return {
    product,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja vöruna." : "",
  };
}
