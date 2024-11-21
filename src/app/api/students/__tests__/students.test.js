/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST, GET } from '~/app/api/students/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user: {
        findUnique: ({ where }) => ({
          id: where.id,
          names: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_professor'
            }
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
        findMany: () => ([
          { 
            id: 2,
            names: 'Student 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
            
          },
          {
            id : 3,
            names: 'Student 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
          }
        ]),
        
        create: ({ data }) => ({
          id: 1, 
          names: data.names,
          paternalSurname: data.paternalSurname,
          maternalSurname: data.maternalSurname,
          currentGroup: data.currentGroup,
          grade: data.grade,
          enrollmentId: data.enrollmentId,
          email: data.email,
          type: data.type,
          shift: data.shift,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
      },
    }, 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/permissions', () => {
  return { validatePermission: () => (true) }
})

describe('API Students - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        2: { 
          id: 2, 
          names: 'Student 1', 
        }, 
        3: { 
          id: 3, 
          names: 'Student 2', 
        } 
      }
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching professors',
      mockImplementation:  new Error('Error fetching professors'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching professors' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Professor - POST', () => {
  it.each([
    {
      descr: 'Successful',
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      }
    },
    {
      descr: 'Error fetching professors',
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
      mockImplementation:  new Error('Error fetching professors'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching professors' }
    },
    {
      descr: 'Error has not permission',
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        names: 'Juan',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'create').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
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