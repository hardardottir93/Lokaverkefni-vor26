import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api/categoriesApi";

export function useCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return {
    categories,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja flokka." : "",
  };
}
