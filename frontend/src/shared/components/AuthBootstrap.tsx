import type { ReactNode } from "react";

import { useAuthBootstrap } from "@/shared/hooks/useAuthBootstrap";

type AuthBootstrapProps = {
  children: ReactNode;
};

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  useAuthBootstrap();
  return <>{children}</>;
};
