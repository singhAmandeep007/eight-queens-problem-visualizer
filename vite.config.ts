import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

/**
 * Vite config for GitHub Pages.
 *
 * - When deploying to https://<user>.github.io/<repo>/, Vite must build with `base: "/<repo>/"`.
 * - When deploying to a custom domain OR root, `base: "/"` is appropriate.
 *
 * This config defaults to "/" for local dev, and uses `GITHUB_PAGES_REPO` in CI (or your shell)
 * to set the correct base path for GitHub Pages deployments.
 *
 * Example:
 *   GITHUB_PAGES_REPO=eight-queens-problem-visualizer npm run build
 */
export default defineConfig(() => {
  const repo = process.env.GITHUB_PAGES_REPO?.trim() ?? "";
  const base = repo ? `/${repo.replace(/^\/+|\/+$/g, "")}/` : "/";

  return {
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
    ],
    base,
    server: {
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: "dist",
    },
  };
});
