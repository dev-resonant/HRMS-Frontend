import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The one backend setting lives in .env as VITE_API_URL (see src/config/env.js).
  const { VITE_API_URL } = loadEnv(mode, __dirname, '')

  // Dev only: the app calls same-origin "/api"; forward it to VITE_API_URL to avoid CORS.
  let proxy
  if (VITE_API_URL) {
    const api = new URL(VITE_API_URL)
    const basePath = api.pathname.replace(/\/$/, '')
    proxy = {
      '/api': {
        target: api.origin,
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api/, basePath),
      },
    }
  }

  return {
    plugins: [react()],
    server: { proxy },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
