/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, DELETE } from '~/app/api/selectionConfig/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      selectionConfig: {
        findUnique: () => ({ 
          id: 1,
          name: 'selectionConfig 1',
          packageSelection: ['packageSelection 1', 'packageSelection 2'],
          trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true  
        }),
        update: ({ data }) => ({
          id: 1, 
          clubSelection: data.clubSelection,
          groups: data.groups,
          trainingSelection: [
            {
              max: 10,
              min: 9,
              date: '2024-11-10T12:00:00Z'
            }
          ],
          packageSelection: [
            {
              max: 10,
              min: 9,
              date: '2024-11-10T12:00:00Z'
            }
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
        delete: ({ where }) => ({
          id: where.id, 
          clubSelection: '2024-11-10T12:00:00Z',
          groups: ['201', '202', '203'],
          trainingSelection: [
            {
              max: 10,
              min: 9,
              date: '2024-11-10T12:00:00Z'
            }
          ],
          packageSelection: [
            {
              max: 10,
              min: 9,
              date: '2024-11-10T12:00:00Z'
            }
          ],
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
              name: 'update_selectionConfig'
            },
            {
              id: 2,
              name: 'findUnique_selectionConfig'
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


describe('API Professor - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'selectionConfig 1', 
        packageSelection: ['packageSelection 1', 'packageSelection 2'],
        trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
        createdAt: 'createdAt',
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
      descr: 'Error fetching selectionConfig',
      mockImplementation:  new Error('Error fetching selectionConfig'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching selectionConfig' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty, id }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: id ?? '1' }
    const response = await GET(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Professor - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        createdAt: 'createdAt',
      },
      request: {
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ]
      },
    },
    {
      descr: 'Error empty data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ]
      },
    },
    {
      descr: 'Error Invalid Input',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' },
      request: {}
    },
    {
      descr: 'Error fetching selectionConfig',
      mockImplementation:  new Error('Error fetching selectionConfig'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching selectionConfig' },
      request: {
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ]
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ]
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findUnique').mockReturnValueOnce(null)
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

describe('API Professor - Delete', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        clubSelection: '2024-11-10T12:00:00Z',
        groups: ['201', '202', '203'],
        trainingSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        packageSelection: [
          {
            max: 10,
            min: 9,
            date: '2024-11-10T12:00:00Z'
          }
        ],
        createdAt: 'createdAt',
      }
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
      descr: 'Error fetching selectionConfig',
      mockImplementation:  new Error('Error fetching selectionConfig'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching selectionConfig' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'delete').mockRejectedValueOnce(mockImplementation) 
    } 
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})