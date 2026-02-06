import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api/student-batches': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/attendance': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/exams': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api/exam-questions': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1 || req.url.includes('.jsx') || req.url.includes('.js')) {
            return req.url;
          }
        }
      },
      '/student': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1 || req.url.includes('.jsx') || req.url.includes('.js')) {
            return req.url;
          }
        }
      },
      '/auth': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
      },
      '/library': {
        target: 'http://192.168.1.25:9191',
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return req.url;
          }
        }
      },
      '/uploads': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
