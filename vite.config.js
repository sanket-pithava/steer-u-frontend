import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ["country-state-city"], // dev-time
  },
  build: {
    target: "es2015", // ✅ ensure ES5 compatible output
    commonjsOptions: {
      include: [/country-state-city/, /node_modules/], // ✅ transpile library
    },
  },
});
