import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import "./index.css";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { router } from "@/app/router/routes";
import { GlobalStyle } from "@/shared/styles/globalStyle";
import { theme } from "@/shared/styles/theme";
import { AuthBootstrap } from "@/shared/components/AuthBootstrap";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") return;
  if (import.meta.env.VITE_API_MOCKING !== "enabled") {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    return;
  }

  const mod = await import("./mocks/browser");
  const { worker } = mod;

  await worker.start({
    onUnhandledRequest: "bypass",
  });

  console.log("[MSW] Mocking enabled.");
}

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <QueryProvider>
          <AuthBootstrap>
            <RouterProvider router={router} />
          </AuthBootstrap>
        </QueryProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

void bootstrap();
