import { describe, it, expect, vi } from 'vitest'
import { validatePermission } from '~/app/api/libs/permissions'

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => 1 }
})
vi.mock('~/app/api/libs/queryDB', () => {
  return {
    default: () => ({
      permissions: [
        { name: 'action_any' }
      ]
    })
  }
})
describe('validatePermission libs', () =>{
  it.each([
    {
      descr: 'The user has the permission',
      entity: {
        name: 'any',
        permissions: {
          action: true
        }
      },
      action: 'action',
      request: 'request',
      result: true
    },
    {
      descr: 'The user has not the permission',
      entity: {
        name: 'any',
        permissions: {
          otherAction: true
        }
      },
      action: 'otherAction',
      request: 'request',
      result: false
    }
  ])('$descr', async ({ result, ...params }) => {
    expect(await validatePermission({ ...params })).toEqual(result)
  })
})