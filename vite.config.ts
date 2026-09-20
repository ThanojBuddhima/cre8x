import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// Vercel serves this project at the domain root, so that is the default.
// GitHub Pages serves it under /cre8x/ - set VITE_BASE=/cre8x/ when building
// for that target. Hardcoding the Pages prefix made every asset URL 404 on
// Vercel, because index.html asked for /cre8x/assets/... at the root.
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
}))
