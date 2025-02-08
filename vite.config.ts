import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Plugin } from 'vite'

// Custom plugin to watch public directory
function watchPublicDir(): Plugin {
  let publicDir: string
  let distDir: string

  // Function to copy a file
  const copyFile = (src: string, dest: string) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    console.log(`Copied ${path.relative(publicDir, src)} to dist directory`)
  }

  // Function to copy directory recursively
  const copyDir = (src: string, dest: string) => {
    const entries = fs.readdirSync(src, { withFileTypes: true })

    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true })
        copyDir(srcPath, destPath)
      } else {
        copyFile(srcPath, destPath)
      }
    })
  }

  return {
    name: 'watch-public',
    buildStart() {
      publicDir = path.resolve(process.cwd(), 'public')
      distDir = path.resolve(process.cwd(), 'dist')

      // Ensure dist directory exists
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true })
      }

      // Initial copy
      if (fs.existsSync(publicDir)) {
        copyDir(publicDir, distDir)
      }

      // Watch for changes in build --watch mode
      fs.watch(publicDir, { recursive: true }, (eventType, filename) => {
        if (filename) {
          const srcPath = path.join(publicDir, filename)
          const destPath = path.join(distDir, filename)

          if (fs.existsSync(srcPath)) {
            copyFile(srcPath, destPath)
          }
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), watchPublicDir()],
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
  }
})
