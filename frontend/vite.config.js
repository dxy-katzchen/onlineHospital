import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],

  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // server: {
  //   host: "0.0.0.0", // Allow access from local network
  //   port: 5173, // Your port number
  //   proxy: {
  //     "/api": {
  //       target: "https://smms.app",
  //       changeOrigin: true,
  //       secure: false,
  //       headers: {
  //         Referer: "https://smms.app",
  //       },
  //     },
  //   },
  // },
});
