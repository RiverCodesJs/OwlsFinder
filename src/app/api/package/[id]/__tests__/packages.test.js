/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/package/[id]/route'

//Mock of DB
vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      package: {
        findUnique: ({ where }) => ({ 
          id: where.id,
          name: 'package 1',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'  
        }),

        update: ({ data }) => ({
          id: 1, 
          name: data.name,
          groupNumber: data.groupNumber,
          description: data.description,
          images: data.images,
          videos: data.videos,
          limit: data.limit,
          subject1: data.subject1,
          subject2: data.subject2,
          subject3: data.subject3,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),

        delete: () => ({
          id: 1,
          name: 'package 1',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active' 
        })
      },

      subject: {
        create: ({ data }) => ({
          id: 3,
          name: data.name,
          description: data.description,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active' 
        }), 
 
        findUnique: ({ where }) => ({
          id: where.id,
          name: `subject ${where.id}`,
          description: `description ${where.id}`
        }),

        update: ({ data, where }) => ({
          id: where.id,
          name: data.name,
          description: data.description,
        })
      }

    } 
  }
})

//Method GET
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
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import ('~/app/api/libs/db')
      db.default.package.findUnique = vi.fn().mockRejectedValueOnce(mockImplementation)
    }

    const params = { id: '1' }

    const response = await GET(null, { params }) 
    
    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

//Method PUT
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
        subject1: 1,
        subject2: 2,
        subject3: 3
      },

      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subject1: {
          id: 1,
          name: 'subject 1',
          description: 'description 1'
        },
        subject2: {
          id: 2,
          name: 'subject',
          description: 'description'
        },
        subject3: {
          name: 'subject 3',
          description: 'description 3'
        }
      }
    },
    {
      descr: 'Invalid Input',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid input' },
      request: {
        id: 1, 
        name: 'package 1',
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
        subject1: {
          id: 1,
          name: 'subject 1',
          description: 'description 1'
        },
        subject2: {
          id: 2,
          name: 'subject 2',
          description: 'description 2'
        },
        subject3: {
          name: 'subject 3',
          description: 'description 3'
        }
      }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockRejectedValueOnce(mockImplementation) 
    }

    const params = { id: '1' }

    const mockRequest = {
      json: async () => request, 
    }
    const response = await PUT(mockRequest, { params }) 
    
    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

//Method PATCH
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
        subject1: 1,
        subject2: 2,
        subject3: 3
      },

      request: {
        id: 1, 
        name: 'package 1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subject1: {
          id: 1,
          name: 'subject 1',
          description: 'description 1'
        },
        subject2: {
          id: 2,
          name: 'subject',
          description: 'description'
        },
        subject3: {
          name: 'subject 3',
          description: 'description 3'
        }
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
        subject1: {
          id: 1,
          name: 'subject 1',
          description: 'description 1'
        },
        subject2: {
          id: 2,
          name: 'subject 2',
          description: 'description 2'
        },
        subject3: {
          name: 'subject 3',
          description: 'description 3'
        }
      }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, 'update').mockRejectedValueOnce(mockImplementation) 
    }

    const params = { id: '1' }

    const mockRequest = {
      json: async () => request, 
    }
    const response = await PATCH(mockRequest, { params }) 
    
    expect(response.status).toBe(expectedStatus)
    
    const jsonResponse = await response.json()
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
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import ('~/app/api/libs/db')
      db.default.package.delete = vi.fn().mockRejectedValueOnce(mockImplementation)
    }

    const params = { id: '1' }

    const response = await DELETE({ params }) 
    
    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
