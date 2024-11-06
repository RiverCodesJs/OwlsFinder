import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/counselor/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: ({ where }) => ({
          id: where.id,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_counselor'
            }
          ],
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

describe('API Counselor - POST', () => {
  it.each([
    {
      descr: 'New counselor complete data',
      newCounselor: true,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 200, 
      expectedResponse: { message: 'Email sent successfully' },
    },
    {
      descr: 'Not Allowed',
      newCounselor: false,
      isNotAllowed: true,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 403, 
      expectedResponse: { error: 'Not Allowed' },
    },
    {
      descr: 'Complete data but not new counselor',
      newCounselor: false,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 409, 
      expectedResponse: { error: 'Email already exists' },
    },
    {
      descr: 'New counselor but incomplete data',
      newCounselor: true,
      request: { }, 
      expectedStatus: 400, 
      expectedResponse: { error: 'Invalid Fields' },
    },
    {
      descr: 'Error creating counselor',
      newCounselor: true,
      mockImplementation: new Error('Error creating counselor'),
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 500, 
      expectedResponse: { error: 'Error creating counselor' },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, newCounselor }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'create').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    if(newCounselor){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique')
        .mockReturnValueOnce({
          id: 2,
          name: 'Jonh',
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
        .mockReturnValueOnce(null)
    }
    const mockRequest = { json: async () => request }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})