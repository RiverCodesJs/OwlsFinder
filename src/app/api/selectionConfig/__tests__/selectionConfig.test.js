/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/selectionConfig/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      selectionConfig: {
        findMany: () => ([
          { 
            id: 1,
            name: 'selectionConfig 1',
            packageSelection: ['packageSelection 1', 'packageSelection 2'],
            trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: true
            
          },
          {
            id : 2,
            name: 'selectionConfig 2',
            packageSelection: ['packageSelection 1', 'packageSelection 2'],
            trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: true
          }
        ]),
        create: ({ data }) => ({
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
          created_at: 'created_at',
          updated_at: 'updated_at',
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
              name: 'create_selectionConfig'
            },
            {
              id: 2,
              name: 'findMany_selectionConfig'
            }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
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

describe('API selectionConfig - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'selectionConfig 1', 
          packageSelection: ['packageSelection 1', 'packageSelection 2'],
          trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
          created_at: 'created_at',
          active: true
        }, 
        2: { 
          id: 2, 
          name: 'selectionConfig 2', 
          packageSelection: ['packageSelection 1', 'packageSelection 2'],
          trainingSelection: ['trainingSelection 1', 'trainingSelection 2'],
          created_at: 'created_at',
          active: true
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
      descr: 'Error fetching selectionConfig',
      mockImplementation:  new Error('Error fetching selectionConfig'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching selectionConfig' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API selectionConfig - POST', () => {
  it.each([
    {
      descr: 'Successful',
      request: {
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
      expectedStatus: 201,
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
        created_at: 'created_at',
        active: true
      }
    },
    {
      descr: 'Error fetching professors',
      request: {
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
      mockImplementation:  new Error('Error fetching selectionConfig'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching selectionConfig' }
    },
    {
      descr: 'Error has not permission',
      request: {
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
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {},
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.selectionConfig, 'create').mockRejectedValueOnce(mockImplementation) 
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