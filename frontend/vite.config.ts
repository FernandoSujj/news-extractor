import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/extract': 'http://localhost:5000',
      '/image-proxy': 'http://localhost:5000',
    },
  },
})
