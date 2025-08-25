// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Ensure environment variables are included
  define: {
    "process.env": process.env,
  },
});
