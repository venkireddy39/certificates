import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-bootstrap', 'bootstrap', 'react-router-dom', 'axios', 'react-toastify'],
          pdfutils: ['html2canvas', 'jspdf'],
          charts: ['recharts'],
          icons: ['react-icons', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {

      // 1. ADMIN & AUTH SERVICE (8081)
      '/admin': {
        target: 'http://192.168.1.87:8081',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://192.168.1.87:8081',
        changeOrigin: true,
        secure: false,
      },
      '/api-identity': {
        target: 'http://192.168.1.87:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-identity/, ''),
      },

      // 2. FEE SERVICE (LOCAL 3130)
      '/api/fee-management': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/fee-types': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/fee-structures': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/fee-allocations': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/fee': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/student/payment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/admin/installment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/admin/early-payment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/admin/settings': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },
      '/api/payments': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
      },

      // 3. MANAGEMENT SERVICE (5151)
      '/api/attendance': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/courses': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/batches': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/student-batches': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/sessions': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/student-batch-transfers': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/certificates': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/exams': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },

      // 4. STATIC FILES (5151)
      '/uploads': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
      },

    }
  }
})