/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/students/[id]/route'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user: {
        findUnique: ({ where }) => ({
          id: where.id,
          names: 'Student 1',
        }),
        update: ({ data, where }) => ({
          id: where.id,
          names: data.names || 'Juan',
          paternalSurname: data.paternalSurname || 'Perez',
          maternalSurname: data.maternalSurname || 'Rodriguez',
          currentGroup: data.currentGroup || '201',
          grade: data.grade || '10',
          enrollmentId: data.enrollmentId || '123456789',
          email: data.email || '123456789@cobachih.edu.mx',
          type: data.type || 'student',
          shift: data.shift || 'morning',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
        delete: ({ where }) => ( { 
          id: where.id,
          name: 'Student 1',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          active: true
        }),
      },
    }, 
  
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/permissions', () => {
  return { validatePermission: () => (true) }
})

describe('API Students - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: {
        id: 1, 
        names: 'Student 1', 
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
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: id ?? '1' }
    const response = await GET(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Students - PUT', () => {
  it.each([
    {
      descr: 'Successful Request',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
    },
    {
      descr: 'Error fetching Students',
      mockImplementation:  new Error('Error fetching Students'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching Students' },
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        names: 'Juan',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null)
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

describe('API Students - PATCH', () => {
  it.each([
    {
      descr: 'Successful Request with no data professor',
      expectedStatus: 200,
      expectedResponse: { 
        id: 1,
        names: 'Sofia',
        paternalSurname: 'Perez',
        maternalSurname: 'Rodriguez',
        currentGroup: '201',
        grade: '10',
        enrollmentId: '123456789',
        email: '123456789@cobachih.edu.mx',
        type: 'student',
        shift: 'morning',
      },
      request: {
        names: 'Sofia',
      },
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not Found' },
      request: {
        names: 'Sofia',
      },
    },
    {
      descr: 'Error fetching Students',
      mockImplementation:  new Error('Error fetching Students'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching Students' },
      request: {
        names: 'Sofia',
      },
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' },
      request: {
        names: 'Sofia',
      },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'update').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false) 
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null)
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
        name: 'Student 1', 
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
      descr: 'Error fetching Students',
      mockImplementation:  new Error('Error fetching Students'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching Students' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'delete').mockRejectedValueOnce(mockImplementation) 
    }
    if(isNotAllowed){
      const permissions = await import ('~/app/api/libs/permissions')
      vi.spyOn( permissions, 'validatePermission').mockReturnValueOnce(false)
    }
    if(isEmpty){
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null)
    }
    const params = { id: '1' }
    const response = await DELETE(null, { params }) 
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})