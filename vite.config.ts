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
  let watcher: fs.FSWatcher | null = null

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

  // Function to update manifest.json version from package.json
  const updateManifestVersion = () => {
    try {
      const packageJsonPath = path.resolve(process.cwd(), 'package.json')
      const manifestJsonPath = path.resolve(distDir, 'manifest.json')

      if (fs.existsSync(packageJsonPath) && fs.existsSync(manifestJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
        const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'))

        if (packageJson.version && packageJson.version !== manifestJson.version) {
          manifestJson.version = packageJson.version
          fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2))
          console.log(`Updated manifest.json version to ${packageJson.version}`)
        }
      }
    } catch (error) {
      console.error('Error updating manifest.json version:', error)
    }
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

      // Only watch when --watch flag is present
      if (process.argv.includes('--watch')) {
        watcher = fs.watch(publicDir, { recursive: true }, (eventType, filename) => {
          if (filename) {
            const srcPath = path.join(publicDir, filename)
            const destPath = path.join(distDir, filename)

            if (fs.existsSync(srcPath)) {
              copyFile(srcPath, destPath)
            }
          }
        })
      }
    },
    writeBundle() {
      // Update manifest.json version after build is complete
      updateManifestVersion()
    },
    closeBundle() {
      // Clean up watcher when build is complete
      if (watcher) {
        watcher.close()
        watcher = null
      }
    }
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
