/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/club/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      club: {
        findUnique: ({ where }) => ( { 
          id: where.id,
          name: 'club 1',
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
          schedule: data.schedule,
          professorId: data.professorId || 2,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),
        delete: ({ where }) => ( { 
          id: where.id,
          name: 'club 1',
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
              name: 'create_club'
            },
            {
              id: 2,
              name: 'update_club'
            },
            {
              id: 3,
              name: 'delete_club'
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

describe('API Club - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'club 1', 
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching club',
      mockImplementation:  new Error('Error fetching club'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching club' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'findUnique').mockRejectedValueOnce(mockImplementation) 
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

describe('API Club - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1
      },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    },
    {
      descr: 'Successful Request but new professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 2
      },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
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
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'update').mockRejectedValueOnce(mockImplementation) 
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

describe('API Club - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request with professor Data',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1
      },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    },
    {
      descr: 'Successful Request with no data professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1
      },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1
      },
    },
    {
      descr: 'Successful Request but new professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 2
      },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    },
    {
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professor:{
          id: 1,
          name: 'Professor 1',
          paternalSurname: 'Paternal Surname',
          maternalSurname: 'Maternal Surname',
          email: 'email@email.com'
        }
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'update').mockRejectedValueOnce(mockImplementation) 
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

describe('API Club - Delete', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'club 1', 
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching club',
      mockImplementation:  new Error('Error fetching club'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching club' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'delete').mockRejectedValueOnce(mockImplementation) 
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