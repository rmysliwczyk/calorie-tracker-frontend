import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

//THIS TO BE CHANGED BEFORE DEPLOYMENT
// https://vite.dev/config/
export default defineConfig({
  plugins: [mkcert(), react()],
  server: {
    https: true,
    host: true
  }
})
