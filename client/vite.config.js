import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api/v1/": {
        target: "https://twitter-clone-backend2024.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
