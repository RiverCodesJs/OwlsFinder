import { describe, it, expect } from 'vitest'
import cleanerData from '~/app/api/libs/cleanerData'


describe('cleanerData libs', () => {
  it.each([
    {
      descr: 'Empty data',
      payload: {},
      includes: undefined,
      result: {}
    },
    {
      descr: 'Has complete payload and not includes any other filter',
      payload: {
        entity: 'Entity',
        password: 'password',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: 'active'
      },
      includes: undefined,
      result: {
        entity: 'Entity',
        active: 'active'
      }
    },
    {
      descr: 'Has complete payload and includes other filter',
      payload: {
        entity: 'Entity',
        subject: [{
          id: 1
        },
        {
          id: 2
        }],
        password: 'password',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: 'active'
      },
      includes: ['subject'],
      result: {
        entity: 'Entity',
        subject: [1, 2],
        active: 'active'
      }
    },
    {
      descr: 'Has complete payload and includes permissions ans other filter',
      payload: {
        entity: 'Entity',
        subject: [{
          id: 1
        },
        {
          id: 2
        }],
        permissions: [{
          name: 'DELETE_CLUBS'
        },
        {
          name: 'EDIT_CLUBS'
        }],
        password: 'password',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: 'active'
      },
      includes: ['subject', 'permissions'],
      result: {
        entity: 'Entity',
        subject: [1, 2],
        permissions: ['DELETE_CLUBS', 'EDIT_CLUBS'],
        active: 'active'
      }
    },
    {
      descr: 'Has complete payload, includes permissions, password, and other filter',
      payload: {
        entity: 'Entity',
        subject: [{
          id: 1
        },
        {
          id: 2
        }],
        permissions: [{
          name: 'DELETE_CLUBS'
        },
        {
          name: 'EDIT_CLUBS'
        }],
        password: 'password',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: 'active'
      },
      includes: ['subject', 'permissions'],
      password: true,
      result: {
        entity: 'Entity',
        password: 'password',
        subject: [1, 2],
        permissions: ['DELETE_CLUBS', 'EDIT_CLUBS'],
        active: 'active'
      }
    }
  ])('$descr', ({ payload, includes, result, password }) =>{
    expect(cleanerData({ payload, includes, password })).toEqual(result)
  })
})