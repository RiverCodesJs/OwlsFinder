/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/permission/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      permission: {
        findUnique: ({ where }) => ({ 
          id: where.id,
          name: 'permission 1',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
        
        update: ({ data }) => ({
          id: 1, 
          name: data.name,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
        delete: () => ({
          id: 1,
          name: 'permission 1',
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
              name: 'update_permission'
            },
            {
              id: 2,
              name: 'delete_permission'
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
        id: 1, 
        name: 'permission 1',
      }
    },
    {
      descr: 'Not Valid ID',
      id: 'NaN',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    },
    {
      descr: 'Error empty data',
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
      descr: 'Error fetching permission',
      mockImplementation:  new Error('Error fetching permission'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching permission' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty, id }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: id ?? '1' }
    const response = await GET(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Permission - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        name: 'permission 1',
        
      },
      request: {
        id: 1, 
        name: 'permission 1',
        
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1, 
        name: 'permission 1',
        
      }
    },
    {
      descr: 'Error Invalid Input',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' },
      request: {
        id: 1, 
      }
    },
    {
      descr: 'Error updating permission',
      mockImplementation:  new Error('Error updating permission'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error updating permission' },
      request: {
        id: 1, 
        name: 'permission 1',
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'permission 1',
      }
    }
    
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const mockRequest = {
      json: async () => request, 
    }
    const response = await PUT(mockRequest, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Permission - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        name: 'permission 1',
        
      },
      request: {
        id: 1, 
        name: 'permission 1',
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1, 
        name: 'permission 1',
        
      }
    },
    {
      descr: 'Error fupdating permission',
      mockImplementation:  new Error('Error updating permission'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error updating permission' },
      request: {
        id: 1, 
        name: 'permission 1',
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'permission 1',
      }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const mockRequest = {
      json: async () => request, 
    }
    const response = await PATCH(mockRequest, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Permission - DELETE', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'permission 1', 
        
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' }
    },
    {
      descr: 'Error deleting permissions',
      mockImplementation:  new Error('Error deleting permissions'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error deleting permissions' }
    },{
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'delete').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    } 
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.permission, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
