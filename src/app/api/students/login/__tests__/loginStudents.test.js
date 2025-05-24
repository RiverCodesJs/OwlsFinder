/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/students/login/route'

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

vi.mock('jsonwebtoken', () => {
  return { 
    default: {
      sign: () => 'successful token'
    }
  }
})

vi.mock('~/app/api/libs/mail/emailSender', () => {
  return { default: () => (true) }
})

describe('API Login - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        grade: 'grade',
        email: 'id@cobachih.edu.mx',
        enrollmentId: 'id',
        currentGroup: 'currentGroup',
        shift: 'shift',
      },
      expectedStatus: 200,
      expectedResponse: { message: 'Email sent successfully' }
    },
    {
      descr: 'Error Not Existed Student',
      isNotExisting: true,
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        email: 'id@cobachih.edu.mx',
        grade: 'grade',
        enrollmentId: 'id',
        currentGroup: 'currentGroup',
        shift: 'shift',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Internal Server Error',
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        email: 'id@cobachih.edu.mx',
        grade: 'grade',
        enrollmentId: 'id',
        currentGroup: 'currentGroup',
        shift: 'shift',
      },
      mockImplementation:  new Error('Error fetching login'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching login' }
    },
    
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotExisting }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotExisting){
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