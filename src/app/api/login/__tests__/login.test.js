/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/login/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: ({ where }) => ({
          id: 1,
          email: where.email,
          password: 'password',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: 'active'
        })
      }
    }, 
  }
})

vi.mock('bcrypt', () => {
  return { 
    default: {
      compare: (inputPassword, realPassword) => inputPassword === realPassword ? true : false 
    }
  }
})

vi.mock('jsonwebtoken', () => {
  return { 
    default: {
      sign: () => 'successful token'
    }
  }
})

describe('API Login - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        email: 'jonh.doe@email.com',
        password: 'password'
      },
      expectedStatus: 200,
      expectedResponse: 'successful token'
    },
    {
      descr: 'Error Empty data',
      isEmpty: true,
      request: {
        email: 'jonh.doe@email.com',
        password: 'password'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Incorrect Password Error',
      request: {
        email: 'jonh.doe@email.com',
        password: 'incorrect password'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Fields Error Missing',
      request: {
        password: 'incorrect password'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Internal Server Error',
      request: {
        email: 'jonh.doe@email.com',
        password: 'password'
      },
      mockImplementation:  new Error('Error fetching login'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching login' }
    },
    
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null) 
    }
    const mockRequest = {
      json: async () => request, 
    }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})