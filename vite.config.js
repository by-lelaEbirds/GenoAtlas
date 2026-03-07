import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GenoAtlas/',
  plugins: [react()],
  resolve: {
    alias: {
      'three/build/three.webgpu.js': 'three/webgpu',
      'three/build/three.webgpu': 'three/webgpu',
      'three/build/three.tsl.js': 'three/tsl',
      'three/build/three.tsl': 'three/tsl'
    }
  }
})
