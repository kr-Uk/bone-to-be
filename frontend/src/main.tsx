import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { QueryProvider } from "@/app/providers/QueryProvider";

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

  console.log("MODE:", import.meta.env.MODE);
  console.log("VITE_API_MOCKING:", import.meta.env.VITE_API_MOCKING);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryProvider>
        <App />
      </QueryProvider>
    </StrictMode>,
  );
}

void bootstrap();
