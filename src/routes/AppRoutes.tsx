import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HomePage from "../pages/HomePage";
import ChessPage from "../pages/ChessPage";
import NotFoundPage from "../pages/NotFoundPage";

/**
 * Central route config with page transitions.
 *
 * Notes:
 * - This project uses HashRouter in `src/main.tsx` for GitHub Pages compatibility.
 * - Keep page transitions here so the rest of the app can remain route-agnostic.
 *
 * Routes:
 *  - /         Home
 *  - /chess    Visualizer
 */
export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
    >
      <Routes
        location={location}
        key={location.pathname}
      >
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chess"
          element={<ChessPage />}
        />

        {/* Back-compat / convenience */}
        <Route
          path="/home"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </AnimatePresence>
  );
}
