import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, brotliSize: true }),
    VitePWA({
      registerType: "autoUpdate",
      filename: "sw.js",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
      includeAssets: ["logo.png", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Clarity Tasks",
        short_name: "C-Tasks",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  publicDir: "public",
});
