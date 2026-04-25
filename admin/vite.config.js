import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    server: {
      port: 5176,
      host: true,
      allowedHosts: [
        'localhost',
        '.ngrok-free.app',
        '.ngrok.io',
        '.ngrok.app',
        '.trycloudflare.com',
        '.loca.lt',
      ],
      proxy: {
        '/api': { target: backendUrl, changeOrigin: true, ws: true },
        '/socket.io': { target: backendUrl, changeOrigin: true, ws: true },
      },
    },
  };
});
