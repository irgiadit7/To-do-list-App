import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url' // <-- Impor baru

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: "/To-do-list-App", 
  resolve: {
    alias: {
      // Gunakan cara ini, ini adalah standar modern untuk Vite
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    
  }
})

