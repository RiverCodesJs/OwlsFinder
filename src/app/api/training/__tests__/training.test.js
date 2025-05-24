/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/training/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      training: {
        findMany: () => ([
          { 
            id: 1,
            name: 'training 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
            
          },
          {
            id : 2,
            name: 'training 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: true
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
          shift: data.shift,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
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
              name: 'create_training'
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

describe('API Training - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'training 1', 
        }, 
        2: { 
          id: 2, 
          name: 'training 2', 
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
      descr: 'Error fetching trainings',
      mockImplementation:  new Error('Error fetching trainings'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching trainings' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Training - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      }
    },
    {
      descr: 'Error fetching trainings',
      request: {
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
      mockImplementation:  new Error('Error fetching trainings'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching trainings' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        description: 'Description about the training',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'create').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
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