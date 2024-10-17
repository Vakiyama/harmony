import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "~src/components": resolve(__dirname, "./src/components"),
      "~libs/cn": resolve(__dirname, "./src/libs/cn")
    },
    conditions: ["development", "browser"],
  },
  build: {
    sourcemap: false,
  }
})
