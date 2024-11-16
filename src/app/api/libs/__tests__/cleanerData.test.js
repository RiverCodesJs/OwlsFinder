import { describe, it, expect } from 'vitest'
import cleanerData from '~/app/api/libs/cleanerData'


describe('cleanerData libs', () => {
  it.each([
    {
      descr: 'Empty data',
      payload: {},
      result: {}
    },
    {
      descr: 'Has complete payload and does not filt password',
      payload: {
        entity: 'Entity',
        password: 'password',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        active: 'active'
      },
      password: true,
      result: {
        password: 'password',
        entity: 'Entity',
      }
    },
  ])('$descr', ({ payload, result, password }) =>{
    expect(cleanerData({ payload, password })).toEqual(result)
  })
})