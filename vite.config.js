import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // A MÁGICA ESTÁ AQUI: Diz ao Vite que estamos no subdiretório GenoAtlas!
  base: '/GenoAtlas/', 
})
