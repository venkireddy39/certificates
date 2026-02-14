import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // 1. ADMIN & AUTH (Port 8081)
      '/admin': { target: 'http://192.168.1.16:8081', changeOrigin: true, secure: false },
      '/auth': { target: 'http://192.168.1.16:8081', changeOrigin: true, secure: false },
      '/api-identity': { target: 'http://192.168.1.16:8081', changeOrigin: true, secure: false, rewrite: (path) => path.replace(/^\/api-identity/, '') },

      // 2. FEE SERVICE (LOCAL 3130)
      '/api/fee-management': { target: 'http://localhost:3130', changeOrigin: true, secure: false },
      '/api/fee-types': { target: 'http://localhost:3130', changeOrigin: true, secure: false },
      '/api/fee-structures': { target: 'http://localhost:3130', changeOrigin: true, secure: false },
      '/api/fee-allocations': { target: 'http://localhost:3130', changeOrigin: true, secure: false },

      // 3. STATIC UPLOADS (Fix for Images showing as default)
      // If backend returns "/uploads/image.jpg", proxy it to 5151
      '/uploads': {
        target: 'http://192.168.1.17:5151',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://192.168.1.17:5151',
        changeOrigin: true,
        secure: false,
      },

      // 4. MANAGEMENT SERVICE (Port 5151)
      '/api': {
        target: 'http://192.168.1.17:5151',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
