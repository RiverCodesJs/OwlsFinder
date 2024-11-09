/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/students/route'

let id = 1

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: ({ where }) => ({
          id: where.id || id,
          email: where.email || 'jonh@email.com',
          permissions: [
            {
              id: 1,
              name: 'create_students'
            }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        update:  ({ data }) => ({
          id: id++,
          names: data.names || 'Jonh',
          email: data.email || 'jonh.doe@gmail.com',
          enrollmentId: data.enrollmentId,
          paternalSurname: data.paternalSurname,
          maternalSurname: data.maternalSurname,
          currentGroup: data.currentGroup,
          grade: data.grade,
          type: data.type,
          shift: data.shift,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        create: ({ data }) => ({
          id: id++, 
          names: data.names,
          email: data.email,
          enrollmentId: data.enrollmentId,
          paternalSurname: data.paternalSurname,
          maternalSurname: data.maternalSurname,
          currentGroup: data.currentGroup,
          grade: data.grade,
          type: data.type,
          shift: data.shift,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
      },
    } 
  }
})

vi.mock('~/app/api/libs/auth', () => {
  return { authenticateToken: () => (1) }
})

vi.mock('~/app/api/libs/getPermissionsByEntity', () => {
  return { default: () => (true) }
})

describe('API Students - POST', () => {
  it.each([
    {
      descr: 'Complete new data',
      newData: true,
      request: 'Grupo,Matricula,Paterno,Materno,Nombre,Promedio\r\n' + '200,23080001,AGUILAR,TORRES,JANET,9\r\n' + '250,23080002,AGUIRRE,COBOS,DANNA YARETZI,"8,9"\r\n', 
      expectedResponse: {
        1: {
          id: 1,
          names: 'JANET',
          email: '23080001@cobachih.edu.mx',
          enrollmentId: '23080001',
          paternalSurname: 'AGUILAR',
          maternalSurname: 'TORRES',
          currentGroup: '200',
          grade: '9',
          type: 'student',
          shift: 'morning',
          active: true
        },
        2: {
          id: 2,
          names: 'DANNA YARETZI',
          email: '23080002@cobachih.edu.mx',
          enrollmentId: '23080002',
          maternalSurname: 'COBOS',
          paternalSurname: 'AGUIRRE',
          currentGroup: '250',
          grade: '8,9',
          type: 'student',
          shift: 'afternoon',
          active: true
        }
      },
      expectedStatus: 201 
    },
    {
      descr: 'Complete data, but is not new',
      request: 'Grupo,Matricula,Paterno,Materno,Nombre,Promedio\r\n' + '200,23080001,AGUILAR,TORRES,JANET,9\r\n' + '250,23080002,AGUIRRE,COBOS,DANNA YARETZI,"8,9"\r\n', 
      expectedResponse: {
        3: {
          id: 3,
          names: 'JANET',
          email: '23080001@cobachih.edu.mx',
          enrollmentId: '23080001',
          paternalSurname: 'AGUILAR',
          maternalSurname: 'TORRES',
          currentGroup: '200',
          grade: '9',
          type: 'student',
          shift: 'morning',
          active: true
        },
        4: {
          id: 4,
          names: 'DANNA YARETZI',
          email: '23080002@cobachih.edu.mx',
          enrollmentId: '23080002',
          maternalSurname: 'COBOS',
          paternalSurname: 'AGUIRRE',
          currentGroup: '250',
          grade: '8,9',
          type: 'student',
          shift: 'afternoon',
          active: true
        }
      },
      expectedStatus: 201 
    },
    {
      descr: 'Empty Data',
      newData: true,
      request: undefined,
      expectedResponse: { error: 'Invalid Fields' },
      expectedStatus: 400 
    },
    {
      descr: 'Invalid Data',
      newData: true,
      request: 'Grupo,Matricula,Paterno,Materno,Nombre,\r\n' + '200,23080001,AGUILAR,TORRES,JANET,9\r\n' + '250,23080002,AGUIRRE,COBOS,DANNA YARETZI,"8,9"\r\n',
      expectedResponse: { error: 'Invalid Fields' },
      expectedStatus: 400 
    },
    {
      descr: 'Any Error',
      newData: true,
      request: 'Grupo,Matricula,Paterno,Materno,Nombre,Promedio\r\n' + '200,23080001,AGUILAR,TORRES,JANET,9\r\n' + '250,23080002,AGUIRRE,COBOS,DANNA YARETZI,"8,9"\r\n', 
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    },
    {
      descr: 'Complete new data',
      newData: true,
      request: 'Grupo,Matricula,Paterno,Materno,Nombre,Promedio\r\n' + '200,23080001,AGUILAR,TORRES,JANET,9\r\n' + '250,23080002,AGUIRRE,COBOS,DANNA YARETZI,"8,9"\r\n', 
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not Allowed' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, newData, request }) =>{
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'create').mockRejectedValueOnce(mockImplementation) 
    }

    if(isNotAllowed){
      const getPermissionsByEntity = await import ('~/app/api/libs/getPermissionsByEntity')
      vi.spyOn( getPermissionsByEntity, 'default').mockReturnValueOnce(false)
    }

    if (newData) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique')
        .mockReturnValueOnce({
          id: 1,
          email: 'existing@email.com',
          permissions: [
            { id: 1, name: 'create_students' }
          ],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        })
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
    }

    const mockRequest = {
      text: async () => request,
      headers: { get: header => (header === 'Content-Type' ? 'text/csv' : null) },
    }
  
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})