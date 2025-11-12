import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ✅ API 요청을 백엔드(Spring Boot)로 전달
      '/api': {
        target: 'http://localhost:8092', // ⚠️ 네 Spring Boot 포트 맞춰줘
        changeOrigin: true,
      },
    },
  },
})
