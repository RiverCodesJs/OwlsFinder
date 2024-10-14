import { describe, it, expect, vi } from 'vitest'
import { authenticateToken } from '~/app/api/libs/auth'
import ERROR from '~/error'

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      verify: () => ({ userId: 1 })
    }
  }
})

describe('auth libs', () =>{
  it.each([
    {
      descr: 'Allowed Token',
      headers: new Headers({ 'authorization': 'token' }),
      mockImplementation: { userId: 1 }, 
      isAllowed: true,
      result: 1
    },
    {
      descr: 'Not Token',
      headers: new Headers({ 'not-authorization': 'token' }),
      isAllowed: false,
      mockImplementation: ERROR.FORBIDDEN, 
      result: 'Not Allowed'
    }
  ])('$descr', async ({ headers, isAllowed, result, mockImplementation }) => {

    if (isAllowed) {
      expect(authenticateToken({ headers })).toEqual(result)
    } else {
      const jwt = await import('jsonwebtoken')
      vi.spyOn(jwt.default, 'verify').mockRejectedValueOnce(mockImplementation) 
      expect(() => authenticateToken({ headers })).toThrow(result)
    }
    
  })
})