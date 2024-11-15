import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/admin/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: () => ({
          id: 1,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_admin'
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
              name: 'create_admin'
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

describe('API admin - POST', () => {
  it.each([
    {
      descr: 'New admin complete data',
      newAdmin: true,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 200, 
      expectedResponse: { message: 'Email sent successfully' },
    },
    {
      descr: 'Not Allowed',
      newAdmin: false,
      isNotAllowed: true,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 403, 
      expectedResponse: { error: 'Not Allowed' },
    },
    {
      descr: 'Complete data but not new admin',
      newAdmin: false,
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 409, 
      expectedResponse: { error: 'Email already exists' },
    },
    {
      descr: 'New admin but incomplete data',
      newAdmin: true,
      request: { }, 
      expectedStatus: 400, 
      expectedResponse: { error: 'Invalid Fields' },
    },
    {
      descr: 'Error creating admin',
      newAdmin: true,
      mockImplementation: new Error('Error creating admin'),
      request: { email: 'example@gmail.com' }, 
      expectedStatus: 500, 
      expectedResponse: { error: 'Error creating admin' },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, newAdmin }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'create').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    if(newAdmin){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique')
        .mockReturnValueOnce({
          id: 2,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_admin'
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