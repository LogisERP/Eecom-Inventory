import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Required for Capacitor — assets must use relative paths for Android WebView
  server: {
    host: true, // Exposes server to network (0.0.0.0)
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
