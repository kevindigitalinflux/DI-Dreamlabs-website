import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    formatting: 'none',
  },
  build: {
    rollupOptions: {
      // Vendor chunking applies to the client bundle only — the SSG server
      // pass externalises these packages and rejects manualChunks for them.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
              'vendor-gsap': ['gsap', '@gsap/react', 'lenis'],
            },
          },
    },
  },
}))
