import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/forgot/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: () => ({
          id: 1,
          email: 'example@mail.com',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
        create: ({ data }) => ({
          id: 2,
          email: data.email,
          type: data.type,
          permissions: [
            {
              id: 1,
              name: 'create_counselor'
            }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        })
      }
    }, 
  
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/getPermissionsByEntity', () => {
  return { default: () => (true) }
})

vi.mock('~/app/api/libs/mail/emailSender', () => {
  return { default: () => (true) }
})

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: () => ('token')
    }
  }
})

describe('API Login - POST', () => {
  it.each([
    {
      descr: 'Complete data',
      request: { email: 'example@mail.com' },
      expectedStatus: 200,
      expectedResponse: { message: 'Email sent successfully' }
    },
    {
      descr: 'Incomplete data',
      request: {},
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Error creating counselor',
      mockImplementation: new Error('Error creating counselor'),
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 500, 
      expectedResponse: { error: 'Error creating counselor' },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }

    const mockRequest = { json: async () => request }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})