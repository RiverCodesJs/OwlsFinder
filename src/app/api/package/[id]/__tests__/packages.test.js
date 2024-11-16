/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/package/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      package: {
        findUnique: ({ where }) => ({ 
          id: where.id,
          name: 'package 1',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true 
        }),
        
        update: ({ data }) => ({
          id: 1, 
          name: data.name,
          groupNumber: data.groupNumber,
          description: data.description,
          images: data.images,
          videos: data.videos,
          limit: data.limit,
          subjects: data.subjects,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),

        delete: () => ({
          id: 1,
          name: 'package 1',
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
              name: 'update_package'
            },
            {
              id: 2,
              name: 'delete_package'
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

describe('API Package - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'package 1', 
        
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
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty, id }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: id ?? '1' }
    const response = await GET(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Package - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [1, 2, 3],
        
      },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error Invalid Input',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' },
      request: {
        id: 1, 
        description: 'package 1',
      }
    },
    {
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findUnique').mockReturnValueOnce(null)
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

describe('API Package - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [1, 2, 3],
        
      },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [
          {
            id: 1,
            name: 'Subject 1',
            description: 'Description of the subject 1'
          },
          {
            id: 2,
            name: 'Subject 2',
            description: 'Description of the subject 2'
          },
          {
            id: 3,
            name: 'Subject 3',
            description: 'Description of the subject 3'
          }
        ]
      }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findUnique').mockReturnValueOnce(null)
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

describe('API Package - DELETE', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'package 1', 
      }
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' }
    },
    {
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    },{
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockRejectedValueOnce(mockImplementation) 
    } else {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockReturnValueOnce({
        id: 1,
        name: 'package 1',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        active: false
      }) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
