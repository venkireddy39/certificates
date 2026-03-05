import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Shared proxy error handler — prevents Vite from crashing with HTTP 500
// when a backend service is down or unreachable
function proxyErrorHandler(err, req, res) {
  console.warn(`[Proxy Error] ${req.method} ${req.url} → ${err.message}`);
  if (!res.headersSent) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service unavailable', message: err.message }));
  }
}

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
        onError: proxyErrorHandler,
        bypass(req) {
          // If the browser is doing a page navigation (Accept: text/html),
          // let Vite serve index.html (SPA fallback) instead of proxying to backend.
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        },
      },
      '/auth': {
        target: 'http://192.168.1.87:8081',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api-identity': {
        target: 'http://192.168.1.87:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-identity/, ''),
        onError: proxyErrorHandler,
      },

      // 2. FEE SERVICE (LOCAL 3130)
      '/api/fee-management': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/fee-types': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/fee-structures': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/fee-allocations': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/fee': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/student/payment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/admin/installment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/admin/early-payment': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/admin/settings': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/payments': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },

      // 3. MANAGEMENT SERVICE (5151)
      '/api/attendance': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/courses': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/batches': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/student-batches': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/sessions': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/student-batch-transfers': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/certificate-templates': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/certificates': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/api/exams': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },

      // 4. STATIC FILES (5151)
      '/uploads': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },
      '/images': {
        target: 'http://192.168.1.63:5151',
        changeOrigin: true,
        secure: false,
        onError: proxyErrorHandler,
      },

    }
  }
})