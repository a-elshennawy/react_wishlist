// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, //auto open report in browser
      gzipSize: true, //shows gzip size of bundle
      brotliSize: true, //shows brotli compressed size
    }),
  ],
});
