/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/professor/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      professor: {
        findUnique: ({ where }) => ( { 
          id: where.id,
          name: 'professor 1',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
        
        update: ({ data, where }) => ({
          id: where.id, 
          name: data.name,
          paternalSurname: data.paternalSurname,
          maternalSurname: data.maternalSurname,
          email: data.email,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
        delete: ({ where }) => ( { 
          id: where.id,
          name: 'professor 1',
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
              name: 'create_professor'
            },
            {
              id: 2,
              name: 'update_professor'
            },
            {
              id: 3,
              name: 'delete_professor'
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

describe('API Professor - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'professor 1', 
        active: true
      }
    },
    {
      descr: 'Not Valid ID',
      id: 'NaN',
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid Fields' }
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
      descr: 'Error fetching professor',
      mockImplementation:  new Error('Error fetching professor'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching professor' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty, id }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findUnique').mockReturnValueOnce(null)
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
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
        active: true
      },
      request: {
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Successful Request but new professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
        active: true
      },
      request: {
        id: 1, 
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
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
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findUnique').mockReturnValueOnce(null)
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

describe('API Professor - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request with no data professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
        active: true
      },
      request: {
        id: 1, 
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        id: 1,
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Error fetching packages',
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' },
      request: {
        id: 1, 
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        name: 'professor 1',
        paternalSurname: 'paternal surname',
        maternalSurname: 'maternal surname',
        email: 'professor@mail.com',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findUnique').mockReturnValueOnce(null)
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

describe('API Professor - Delete', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'professor 1', 
        active: false
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
      descr: 'Error fetching professor',
      mockImplementation:  new Error('Error fetching professor'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching professor' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'update').mockRejectedValueOnce(mockImplementation) 
    } else {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'update').mockReturnValueOnce({
        id: 1,
        name: 'professor 1',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: false
      }) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.professor, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})