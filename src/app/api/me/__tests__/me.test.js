import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/me/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user: {
        findUnique: () => ({ 
          id: 1,
          names: 'user 1',
          email: 'user@gmail.com',
          created_at: 'created_at',
          updated_at: 'updated_at',
          permissions: [
            {
              id: 1,
              name: 'permission 1',
            },
            {
              id: 2,
              name: 'permissions 2',
            },
          ],
          active: true
        }),
        update: ({ data, where }) => ({
          id: where.id, 
          names: data.names || 'names',
          paternalSurname: data.paternalSurname || 'paternalSurname',
          maternalSurname: data.maternalSurname || 'maternalSurname',
          email: data.email || 'email',
          enrollmentId: data.enrollmentId || 'enrollmentId',
          groups: data.groups || 'groups',
          currentGroup: data.currentGroup || 'currentGroup',
          nextGroup: data.nextGroup || 'nextGroup',
          shift: data.shift || 'shift',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: data.active || true
        })
      },
    }, 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/getPermissionsByEntity', () => {
  return { default: () => (true) }
})

describe('API Me - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        names: 'user 1',
        email: 'user@gmail.com',
        permissions: ['permission 1', 'permissions 2'],
        active: true
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error fetching me',
      mockImplementation:  new Error('Error fetching me'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching me' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Me - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        names: 'new name',
        paternalSurname: 'new paternalSurname',
        maternalSurname: 'new maternalSurname',
        email: 'new email',
        enrollmentId: 'new enrollmentId',
        groups: 'new groups',
        currentGroup: 'new currentGroup',
        nextGroup: 'new nextGroup',
        shift: 'new shift',
        active: true
      },
      request: {
        id: 1,
        names: 'new name',
        paternalSurname: 'new paternalSurname',
        maternalSurname: 'new maternalSurname',
        email: 'new email',
        enrollmentId: 'new enrollmentId',
        groups: 'new groups',
        currentGroup: 'new currentGroup',
        nextGroup: 'new nextGroup',
        shift: 'new shift',
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
      descr: 'Error updatin me',
      mockImplementation:  new Error('Error updatin me'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error updatin me' },
      request: {
        id: 1,
        names: 'new name',
        paternalSurname: 'new paternalSurname',
        maternalSurname: 'new maternalSurname',
        email: 'new email',
        enrollmentId: 'new enrollmentId',
        groups: 'new groups',
        currentGroup: 'new currentGroup',
        nextGroup: 'new nextGroup',
        shift: 'new shift',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        names: 'new name',
        paternalSurname: 'new paternalSurname',
        maternalSurname: 'new maternalSurname',
        email: 'new email',
        enrollmentId: 'new enrollmentId',
        groups: 'new groups',
        currentGroup: 'new currentGroup',
        nextGroup: 'new nextGroup',
        shift: 'new shift',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    const mockRequest = {
      json: async () => request, 
    }
    const response = await PUT(mockRequest) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Me - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1, 
        names: 'new name',
        paternalSurname: 'paternalSurname',
        maternalSurname: 'maternalSurname',
        email: 'email',
        enrollmentId: 'enrollmentId',
        groups: 'groups',
        currentGroup: 'currentGroup',
        nextGroup: 'nextGroup',
        shift: 'shift',
        active: true
      },
      request: {
        id: 1,
        names: 'new name',
      },
    },
    {
      descr: 'Error updatin me',
      mockImplementation:  new Error('Error updatin me'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error updatin me' },
      request: {
        id: 1,
        names: 'new name',
        paternalSurname: 'new paternalSurname',
        maternalSurname: 'new maternalSurname',
        email: 'new email',
        enrollmentId: 'new enrollmentId',
        groups: 'new groups',
        currentGroup: 'new currentGroup',
        nextGroup: 'new nextGroup',
        shift: 'new shift',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        id: 1, 
        names: 'new name',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false) 
    }
    const mockRequest = {
      json: async () => request, 
    }
    const response = await PATCH(mockRequest) 
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
        name: 'user 1', 
        active: 'false'
      }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    },
    {
      descr: 'Error deleting me',
      mockImplementation:  new Error('Error deleting me'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error deleting me' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockRejectedValueOnce(mockImplementation) 
    } else {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockReturnValueOnce({
        id: 1,
        name: 'user 1',
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: 'false'
      }) 
    }
    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }
    const response = await DELETE() 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})