/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/professor/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      professor: {
        findMany: () => ([
          { 
            id: 1,
            name: 'professor 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
            
          },
          {
            id : 2,
            name: 'professor 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
          }
        ]),
        
        create: ({ data }) => ({
          id: 1, 
          name: data.name,
          paternalSurname: data.paternalSurname,
          maternalSurname: data.maternalSurname,
          email: data.email,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
      },
      user:{
        findUnique: ({ where }) => ({
          id: where.id,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_professor'
            }
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        })
      }
    }, 
  
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/permissions', () => {
  return { validatePermission: () => (true) }
})

describe('API Professor - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'professor 1', 
        }, 
        2: { 
          id: 2, 
          name: 'professor 2', 
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
      vi.spyOn(db.default.professor, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findMany').mockReturnValueOnce([]) 
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
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      }
    },
    {
      descr: 'Error fetching professors',
      request: {
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
      mockImplementation:  new Error('Error fetching professors'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching professors' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        email: 'professor@mail.com',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'create').mockRejectedValueOnce(mockImplementation) 
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