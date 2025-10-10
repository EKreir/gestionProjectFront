import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy dev : redirige les requêtes /api -> ton backend Spring Boot (localhost:8080)
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // recommandé pour éviter des problèmes d'origine
        secure: false       // si tu utilises HTTPS local auto-signé, sinon true
      }
    }
  },
  plugins: [react()],
})
