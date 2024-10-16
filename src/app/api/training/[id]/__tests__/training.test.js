/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/training/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      training: {
        findUnique: ({ where }) => ( { 
          id: where.id,
          name: 'training 1',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
          
        }),
        
        update: ({ data, where }) => ({
          id: where.id, 
          name: data.name,
          groupNumber: data.groupNumber,
          description: data.description,
          images: data.images,
          videos: data.videos,
          limit: data.limit,
          shift: data.shift,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),
        delete: ({ where }) => ( { 
          id: where.id,
          name: 'training 1',
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
              name: 'create_training'
            },
            {
              id: 2,
              name: 'update_training'
            },
            {
              id: 3,
              name: 'delete_training'
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

describe('API Training - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'training 1', 
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching training',
      mockImplementation:  new Error('Error fetching training'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching training' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'findUnique').mockRejectedValueOnce(mockImplementation) 
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

describe('API training - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
      request: {
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
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
      descr: 'Error fetching training',
      mockImplementation:  new Error('Error fetching training'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching training' },
      request: {
        id: 1, 
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'update').mockRejectedValueOnce(mockImplementation) 
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

describe('API training - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request with no data professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
      request: {
        id: 1, 
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
    },
    {
      descr: 'Error fetching training',
      mockImplementation:  new Error('Error fetching training'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching training' },
      request: {
        id: 1, 
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'training 1',
        groupNumber: 201,
        description: 'Description about the training',
        images: ['image1'],
        videos: ['video1'],
        shift: 'shift',
        limit: 30,
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'update').mockRejectedValueOnce(mockImplementation) 
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

describe('API training - Delete', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'training 1', 
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching training',
      mockImplementation:  new Error('Error fetching training'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching training' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.training, 'delete').mockRejectedValueOnce(mockImplementation) 
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