import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gsap: ['gsap'],
          icons: ['lucide-react'],
          tiptap: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-highlight']
        }
      }
    }
  },
  test: {
    setupFiles: './src/test/setup.js'
  }
});
