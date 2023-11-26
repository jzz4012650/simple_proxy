import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // avoid clean dist and copy public folder when start dev:views & dev:background together
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/background/index.ts'),
      name: 'background',
      fileName: 'background',
      formats: ['es'],
    },
  }
});
