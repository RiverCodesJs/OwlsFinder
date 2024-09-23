import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8', 
      reportsDirectory: './coverage',
      all: true, 
      reporter: ['text', 'lcov'], 
    },
  },
})