import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['react-markdown']
  },
  server: {
    proxy: {
      // Cloudflare Functions Proxy
      '/api/cv': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        secure: false,
      },
      '/api/jd': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        secure: false,
      },
      // Legacy Express Server Proxy (for Jobs, Candidates, etc.)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
