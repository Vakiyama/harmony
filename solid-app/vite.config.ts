import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "~src/components": resolve(__dirname, "./src/components"),
      "~libs/cn": resolve(__dirname, "./src/libs/cn"),
    },
    conditions: ["development", "browser"],
  },
  build: {
    sourcemap: false,
  },
  // ssr: {
  //   noExternal: ["solid-js", "solid-app-router"],
  // },
});
