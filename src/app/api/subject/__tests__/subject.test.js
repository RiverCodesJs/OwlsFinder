/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/subject/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      subject:{
        findMany: () => ([
          { 
            id: 1,
            name: 'subject 1',
            description: 'description 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
            
          },
          {
            id : 2,
            name: 'subject 2',
            description: 'description 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
          }
        ]),

        create: ({ data }) => ({
          id: 1,
          name: data.name,
          description: data.description,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        })
      },
      user:{
        findUnique: ({ where }) => ({
          id: where.id,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_subject'
            }
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        })
      }
    } 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/permissions', () => {
  return { validatePermission: () => (true) }
})

describe('API subjects - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'subject 1',
          description: 'description 1',
        }, 
        2: { 
          id: 2, 
          name: 'subject 2',
          description: 'description 2',
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
      descr: 'Error fetching subjects',
      mockImplementation:  new Error('Error fetching subjects'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching subjects' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API subjects - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'subject 1',
        description: 'description 1',
      }
    },
    {
      descr: 'Invalid Input Error',
      request: {
        name: 'subject 1',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      expectedStatus: 403,
      isNotAllowed: true,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching subjects',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      mockImplementation:  new Error('Error fetching subjects'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching subjects' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'create').mockRejectedValueOnce(mockImplementation) 
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