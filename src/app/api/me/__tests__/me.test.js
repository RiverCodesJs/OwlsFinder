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
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          permissions: [
            {
              name: 'permissions 1',
            },
            {
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
          permissions: [
            {
              id: 1,
              name: 'permissions 1',
            },
            {
              id: 2,
              name: 'permissions 2',
            },
          ],
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: data.active || true
        })
      },
    }, 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/permissions', async () => {
  const actual = await vi.importActual('~/app/api/libs/permissions')
  return {
    ...actual, 
    getPermissionsByEntity: () => true 
  }
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
        permissions: {
          'permissions 1': {}, 
          'permissions 2': {}
        },
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
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'getPermissionsByEntity').mockReturnValueOnce(false)
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
        permissions: {
          'permissions 1': {}, 
          'permissions 2': {}
        }
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
        password:'password',        
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
      descr: 'Error updating me',
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
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'getPermissionsByEntity').mockReturnValueOnce(false) 
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
        permissions: {
          'permissions 1': {}, 
          'permissions 2': {}
        },
      },
      request: {
        id: 1,
        names: 'new name',
        password:'password'
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
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'getPermissionsByEntity').mockReturnValueOnce(false) 
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

describe('API Me - Delete', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        name: 'user 1', 
        permissions: {
          'permissions 1': {}, 
          'permissions 2': {}
        },
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        permissions: [
          {
            id: 1,
            name: 'permissions 1',
          },
          {
            id: 2,
            name: 'permissions 2',
          },
        ],
        active: 'false'
      }) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'getPermissionsByEntity').mockReturnValueOnce(false)
    }
    const response = await DELETE() 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})