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

        update: ({ where }) => ({
          id: where.id,
          name: 'subject 1',
          description: 'description 1'
        }),

        delete: ({ where }) => ({
          id: where.id,
          name: 'subject 1',
          description: 'description 1'
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
        id: 1, 
        name: 'subject 1',
        description: 'description 1'
      }, 
      
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
      vi.spyOn(db.default.subject, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    const params = { id: '1' }

    const response = await GET({ params })

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
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
      vi.spyOn(db.default.subject, 'update').mockRejectedValueOnce(mockImplementation) 
    }

    const mockRequest = {
      json: async () => request, 
    }

    const params = { id: '1' }
  
    const response = await PUT(mockRequest, { params })

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    
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
        description: 'description 1'
      }
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
      vi.spyOn(db.default.subject, 'update').mockRejectedValueOnce(mockImplementation) 
    }

    const mockRequest = {
      json: async () => request, 
    }

    const params = { id: '1' }
  
    const response = await PATCH(mockRequest, { params })

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    
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
      descr: 'Error fetching subjects',
      request: {
        name: 'subject 1',
        description: 'description 1'
      },
      mockImplementation:  new Error('Error fetching subjects'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching subjects' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.subject, 'delete').mockRejectedValueOnce(mockImplementation) 
    }

    const params = { id: '1' }
  
    const response = await DELETE({ params })

    expect(response.status).toBe(expectedStatus)

    const jsonResponse = await response.json()
    
    expect(jsonResponse).toEqual(expectedResponse)
  })
})