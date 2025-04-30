import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://prod-30.brazilsouth.logic.azure.com:443/workflows/145bc6b9b96a4bcd819e4e27983801c3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=BjzmSFg5ZGJuV53vHMbHT22YSDpKqABGK9zmKWEJk4Q&path="
})
