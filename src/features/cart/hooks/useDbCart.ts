import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { getCartItemsForUser } from "../api/cartApi";
import type { SupabaseCartItem } from "../api/cartApi";

export function useDbCart(user: User | null) {
  const {
    data: dbItems = [],
    isLoading,
    error,
  } = useQuery<SupabaseCartItem[]>({
    queryKey: ["db-cart", user?.id],
    queryFn: () => {
      if (!user) {
        return Promise.resolve([]);
      }

      return getCartItemsForUser(user);
    },
    enabled: Boolean(user),
  });

  return {
    dbItems,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja körfu." : "",
  };
}
