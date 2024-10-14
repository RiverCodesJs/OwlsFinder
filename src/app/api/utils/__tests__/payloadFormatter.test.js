import { describe, it, expect } from 'vitest'
import payloadFormatter from '~/app/api/utils/payloadFormatter'

describe('payloadFormatter utils', () => {
  it.each([
    {
      descr: 'Empty data',
      arr: [],
      result: {}
    },
    {
      descr: 'Single data',
      arr: [{ id: 1, name: 'Lalo' }],
      result: { 1: { id: 1, name: 'Lalo' } }
    },
    {
      descr: 'Multiple data',
      arr: [{ id: 1, name: 'Lalo' }, { id: 2, name: 'Chava' }],
      result: { 1: { id: 1, name: 'Lalo' }, 2: { id: 2, name: 'Chava' } }
    }

  ])('$descr', ({ arr, result }) => {
    expect(payloadFormatter(arr)).toEqual(result)
  })
})