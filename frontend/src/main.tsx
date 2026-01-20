import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { QueryProvider } from "@/app/providers/QueryProvider";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") return;

  const mod = await import("./mocks/browser");
  const { worker } = mod;

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryProvider>
        <App />
      </QueryProvider>
    </StrictMode>,
  );
}

void bootstrap();
