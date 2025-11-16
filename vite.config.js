import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5202, // your frontend
    proxy: {
      "/api": {
        target: "http://localhost:7249",  // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
