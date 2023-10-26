import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": "localhost:8080/api"
    }
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "src")
    }
  }
})
