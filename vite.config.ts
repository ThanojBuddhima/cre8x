import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// GitHub Pages serves this project at /cre8x/, so the production build needs
// that prefix. Dev stays at / so local URLs are unchanged.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/cre8x/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
}))
