import { defineConfig } from 'vite'
import { env } from "./src/config/env.config.ts"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: env.PORT,
    open: '/',
  }
})
