import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Smaller chunk size for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunk
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
        },
      },
    },
    // Target modern browsers
    target: 'es2020',
    // Enable minification
    minify: 'esbuild',
    // Source map for debugging (production: hidden)
    sourcemap: false,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
  // Server config
  server: {
    // Enable compression
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
