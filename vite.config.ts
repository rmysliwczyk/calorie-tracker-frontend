import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

//THIS TO BE CHANGED BEFORE DEPLOYMENT
// https://vite.dev/config/
export default defineConfig({
  plugins: [mkcert(), react()],
  server: {
    port: 8081,
    https: false,
    host: "0.0.0.0",
    origin: "http://0.0.0.0:8081",
    allowedHosts: ["ct.mysliwczykrafal.webredirect.org", "www.ct.mysliwczykrafal.webredirect.org"]
  }
})
