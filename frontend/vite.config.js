import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Allow LAN access (so phones on the same Wi-Fi can hit the dev
      // server) and tunnels (ngrok / cloudflared) — Vite v5 blocks unknown
      // Host headers by default. ".ngrok-free.app" matches any subdomain.
      host: true,
      allowedHosts: [
        "localhost",
        ".ngrok-free.app",
        ".ngrok.io",
        ".ngrok.app",
        ".trycloudflare.com",
        ".loca.lt",
      ],
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          ws: true,
        },
        "/socket.io": {
          target: backendUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
