/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/club/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      club: {
        findMany: () => ([
          { 
            id: 1,
            name: 'club 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            active: 'active'
            
          },
          {
            id : 2,
            name: 'club 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
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
          schedule: data.schedule,
          professorId: data.professor.id || 1,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
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
            }
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: 'active'
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

describe('API Club - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        1: { 
          id: 1, 
          name: 'club 1', 
        }, 
        2: { 
          id: 2, 
          name: 'club 2', 
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
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' }
    },
    {
      descr: 'Error fetching clubs',
      mockImplementation:  new Error('Error fetching clubs'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching clubs' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if(mockImplementation){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'findMany').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'findMany').mockReturnValueOnce([]) 
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Club - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
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
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'club 1',
        groupNumber: 201,
        description: 'Description about the club',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1,
      }
    },
    {
      descr: 'Successful response but with a new professor',
      request: {
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
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
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: 1,
      }
    },
    {
      descr: 'Successful response but without professor',
      notProfessor: true,
      request: {
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: null,
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
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, notProfessor }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'create').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    const mockRequest = {
      json: async () => request, 
    }
    if(notProfessor){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.club, 'create').mockReturnValueOnce({
        id: 1, 
        name: 'package1',
        groupNumber: 201,
        description: 'Description about the package',
        images: ['image1'],
        videos: ['video1'],
        schedule: 'schedule',
        limit: 30,
        professorId: null,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        active: 'active'
      }) 
    }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})