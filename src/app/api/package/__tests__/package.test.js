/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/package/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      package: {
        findMany: () => ([
          { 
            id: 1,
            name: 'package1',
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
            
          },
          {
            id : 2,
            name: 'package2',
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
          }
        ]),
        
        create: ({ data }) => ({
          id: 1, 
          name: data.name,
          groupNumber: data.groupNumber,
          description: data.description,
          images: data.images,
          videos: data.videos,
          limit: data.limit,
          subjects: data.subjects,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),
      },
      user:{
        findUnique: ({ where }) => ({
          id: where.id,
          name: 'Jonh',
          permissions: [
            {
              id: 1,
              name: 'create_package'
            }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
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

describe('API Package - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'package1', 
          active: 'active'
        }, 
        2: { 
          id: 2, 
          name: 'package2', 
          active: 'active'
        } 
      }
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
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }

    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }

    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Package - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'package1',
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
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subjects: [1, 2, 3],
        active: 'active'
      }
    },
    {
      descr: 'Error fetching packages',
      request: {
        name: 'package1',
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
      },
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'package1',
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
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        description: 'Description about the package',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'create').mockRejectedValueOnce(mockImplementation) 
    }

    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
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