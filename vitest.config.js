import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8', 
      reportsDirectory: './coverage',
      all: true, 
      reporter: ['text', 'json-summary', 'json'], 
      reportOnFailure: true,
    },
    exclude: [
      'node_modules/**',
      '**/playwright.config.js',
      '**/next.config.mjs',
      '**/tests/**', 
    ],
  },
})