/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/subject/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      subject:{
        findUnique: () => ({ 
          id: 1,
          name: 'subject 1',
          description: 'description 1',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),

        update: ({ where, data }) => ({
          id: where.id,
          name: data.name || 'subject updated',
          description: data.description || 'description updated'
        }),

        delete: ({ where }) => ({
          id: where.id,
          name: 'subject 1',
          description: 'description 1'
        })
      },
      user:{
        findUnique: ({ where }) => ({
          id: where.id,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'update_subject'
            },
            {
              id: 2,
              name: 'delete_subject'
            }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        })
      }
    } 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/getPermissionsByEntity', () => {
  return { default: () => (true) }
})

describe('API subjects - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'subject 1',
        description: 'description 1'
      }, 
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
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }

    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }


    const params = { id: '1' }
    const response = await GET(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API subjects - PUT', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'subject 1',
        description: 'description 1'
      }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      expectedResponse: { error: 'Not Allowed' },
      isNotAllowed: true,
      expectedStatus: 403,
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
      vi.spyOn(db.default.subject, 'update').mockRejectedValueOnce(mockImplementation) 
    }

    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
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

describe('API subjects - PATCH', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'subject 1',
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'subject 1',
        description: 'description updated'
      }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'subject 1',
      },
      isNotAllowed: true,
      expectedStatus: 403,
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
      vi.spyOn(db.default.subject, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
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

describe('API subjects - DELETE', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'subject 1',
        description: 'description 1'
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
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
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'delete').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    } 
    
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})