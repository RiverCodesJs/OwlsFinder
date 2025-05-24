/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/permission/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      permission: {
        findMany: () => ([
          { 
            id: 1,
            name: 'permission 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
            
          },
          {
            id : 2,
            name: 'permission 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
          }
        ]),
        
        create: ({ data }) => ({
          id: 1, 
          name: data.name,
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
              name: 'create_permission'
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

describe('API Permission - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'permission 1',  
        }, 
        2: { 
          id: 2, 
          name: 'permission 2', 
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
      descr: 'Error fetching permissions',
      mockImplementation:  new Error('Error fetching permissions'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching permissions' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Permission - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 201,
      request: {
        name: 'permission 1',
      },
      expectedResponse: {
        id: 1,
        name: 'permission 1',
        
      }
    },
    {
      descr: 'Error creating permissions',
      request: {
        name: 'permission 1',
      },
      mockImplementation:  new Error('Error creating permissions'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error creating permissions' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'permission 1',
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'create').mockRejectedValueOnce(mockImplementation) 
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