import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { getOrdersForUser } from "../api/ordersApi";

export function useOrders(user: User | null) {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => {
      if (!user) {
        return Promise.resolve([]);
      }

      return getOrdersForUser(user);
    },
    enabled: Boolean(user),
  });

  return {
    orders,
    isLoading,
    errorMessage: error ? "Ekki tókst að sækja pantanir." : "",
  };
}
