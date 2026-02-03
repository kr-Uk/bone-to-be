import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthLoading || isLoggedIn) return;

    // Direct URL access (not from internal navigation)
    // This only handles direct browser URL access
    // Internal navigation is blocked by useProtectedNavigate hook
    navigate("/login", {
      replace: true,
      state: { returnTo: location.pathname },
    });
  }, [isAuthLoading, isLoggedIn, location, navigate]);

  if (isAuthLoading) return null;
  if (!isLoggedIn) return null;

  return <>{children}</>;
};
