import { useNavigate } from "react-router-dom";

import { useAuth } from "./useAuth";

import { useAuthStore } from "@/shared/stores/authStore";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/diagnosis", "/profile", "/community", "/withdraw", "/forbidden"];

/**
 * Custom navigation hook that prevents route changes for unauthenticated users
 * and shows login modal instead
 */
export const useProtectedNavigate = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth({ enabled: false });
  const { openAuthRequiredModal } = useAuthStore();

  const protectedNavigate = (
    to: string,
    options?: { replace?: boolean; state?: Record<string, unknown> },
  ) => {
    // Check if the target route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => to.startsWith(route));

    // If not logged in and trying to access protected route
    if (!isLoggedIn && isProtectedRoute) {
      // Show modal instead of navigating
      openAuthRequiredModal(to);
      return;
    }

    // Otherwise, navigate normally
    navigate(to, options);
  };

  return protectedNavigate;
};
