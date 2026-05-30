import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "../lib/supabase";

export function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(Boolean(session));
      setIsLoading(false);
    }

    checkSession();
  }, []);

  if (isLoading) {
    return <p>Hleð...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
