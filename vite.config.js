import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GenoAtlas/',
  plugins: [react()],
  resolve: {
    alias: {
      'three/webgpu': 'three/build/three.webgpu.js',
      'three/tsl': 'three/build/three.tsl.js'
    }
  }
})
