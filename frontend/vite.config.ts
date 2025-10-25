// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // This is the default, but good to have here
    proxy: {
      // This is the proxy configuration
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        secure: false,
      }
    }
  }
})