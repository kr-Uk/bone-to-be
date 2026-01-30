import { useEffect } from "react";
import axios from "axios";

import { getMe } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/stores/authStore";

export const useAuthBootstrap = () => {
  const { hasCheckedAuth, setAuth, clearAuth, setAuthLoading, setHasCheckedAuth } = useAuthStore();

  useEffect(() => {
    if (hasCheckedAuth) {
      return;
    }

    const run = async () => {
      setHasCheckedAuth(true);
      setAuthLoading(true);
      try {
        const me = await getMe();
        setAuth(me);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          clearAuth();
        } else {
          clearAuth();
        }
      } finally {
        setAuthLoading(false);
        setHasCheckedAuth(true);
      }
    };

    void run();
  }, [hasCheckedAuth, setAuth, clearAuth, setAuthLoading, setHasCheckedAuth]);
};
