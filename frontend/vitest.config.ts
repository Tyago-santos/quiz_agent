import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    exclude: [
      ...configDefaults.exclude,
      "**/tests/**", // Ignora a pasta padrão de testes do Playwright
      "**/e2e/**", // Ignora caso sua pasta se chame e2e
    ],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
