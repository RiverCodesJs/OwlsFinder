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
          subject1: data.subject1,
          subject2: data.subject2,
          subject3: data.subject3,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),
      },

      subject:{
        create: ({ data }) => ({
          id: 3,
          name: data.name,
          description: data.description
        })
      }
    } 
  }
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
        }, 
        2: { 
          id: 2, 
          name: 'package2', 
        } 
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
      db.default.package.findMany = vi.fn().mockRejectedValueOnce(mockImplementation)
    }

    const response = await GET()

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
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
        subject1: {
          id: 1,
          name: 'Subject 1',
          description: 'Description of the subject 1'
        },
        subject2: {
          id: 2,
          name: 'Subject 2',
          description: 'Description of the subject 2'
        },
        subject3: {
          id: 3,
          name: 'Subject 3',
          description: 'Description of the subject 3'
        }
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
        subject1: 1,
        subject2: 2,
        subject3: 3
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
        subject1: {
          id: 1,
          name: 'Subject 1',
          description: 'Description of the subject 1'
        },
        subject2: {
          id: 2,
          name: 'Subject 2',
          description: 'Description of the subject 2'
        },
        subject3: {
          name: 'Subject 3',
          description: 'Description of the subject 3'
        }
      },
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    },
    {
      descr: 'Error invalid input',
      request: {
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        limit: 30,
        subject1: {
          id: 1,
          name: 'Subject 1',
          description: 'Description of the subject 1'
        },
        subject2: {
          id: 2,
          name: 'Subject 2',
          description: 'Description of the subject 2'
        },
        subject3: {
          id: 3,
          name: 'Subject 3',
          description: 'Description of the subject 3'
        }
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid input' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import ('~/app/api/libs/db')
      db.default.package.create = vi.fn().mockRejectedValueOnce(mockImplementation)
    }

    const mockRequest = {
      json: async () => request, 
    }
  
    const response = await POST(mockRequest)

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    
    expect(jsonResponse).toEqual(expectedResponse)
  })
})