import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
}))

vi.mock('~/libs/query', () => ({
  default: vi.fn(),
}))