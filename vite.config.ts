import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'options.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === 'background') {
            return '[name].js';
          } else {
            return 'assets/[name]-[hash].js';
          }
        },
      }
    },
    // lib: {
    //   entry: resolve(__dirname, 'src/background/index.js'),
    //   name: 'background',
    //   fileName: 'background',
    //   formats: ['es'],
    // },
  }
})
