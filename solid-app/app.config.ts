import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    ssr: { external: ["drizzle-orm"] },
    optimizeDeps: {
      esbuildOptions: { target: ["esnext"] },
      exclude: ["effect"],
    },
  },
  solid: {
    exclude: ["**/node_modules/.vinxi/client/deps/**/*"],
  },
});
