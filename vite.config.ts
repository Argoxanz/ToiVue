import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ionic: ['@ionic/vue', '@ionic/vue-router'],
          charts: ['apexcharts', 'vue3-apexcharts'],
          utils: ['axios', 'jspdf', 'jspdf-autotable', 'xlsx'],
        },
      },
    },
  },
})
