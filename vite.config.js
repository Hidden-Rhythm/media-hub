import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/stream': 'http://127.0.0.1:5000',
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
