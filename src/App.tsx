import React from "react";

import GlobalStyles from "./globalStyles";
import ErrorBoundary from "./components/ErrorBoundary";

import AppShell from "./ui/AppShell";
import AppRoutes from "./routes/AppRoutes";

/**
 * Root app entry.
 *
 * Routing is defined in `src/routes/AppRoutes.tsx`.
 * Router type is configured in `src/main.tsx` (HashRouter for GitHub Pages).
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <AppShell>
        <AppRoutes />
      </AppShell>
    </ErrorBoundary>
  );
}
