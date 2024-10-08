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
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
            
          },
          {
            id : 2,
            name: 'subject 2',
            description: 'description 2',
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
          }
        ]),

        create: ({ data }) => ({
          id: 1,
          name: data.name,
          description: data.description
        })
      }
    } 
  }
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
          description: 'description 1'
        }, 
        2: { 
          id: 2, 
          name: 'subject 2',
          description: 'description 2',
        } 
      }
    },
    {
      descr: 'Error fetching subjects',
      mockImplementation:  new Error('Error fetching subjects'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching subjects' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }

    const response = await GET()

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
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
        description: 'description 1'
      }
    },
    {
      descr: 'Invalid Input Error',
      request: {
        name: 'subject 1',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid input' }
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
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'create').mockRejectedValueOnce(mockImplementation) 
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