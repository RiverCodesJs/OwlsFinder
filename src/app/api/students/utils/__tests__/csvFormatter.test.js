import { describe, it, expect } from 'vitest'
import csvFormatter from '~/app/api/students/utils/csvFormatter'

describe('csvFormatter utils', () => {
  it.each([
    {
      descr: 'Empty data',
      parsedData: [],
      error: false,
      result: []
    },
    {
      descr: 'Complete data',
      parsedData: [
        {
          Grupo: '100',
          Matricula: '12345678',
          Paterno: 'PEREZ',
          Materno: 'LOPEZ',
          Nombre: 'JUAN',
          Promedio: 10
        },
        {
          Grupo: '150',
          Matricula: '12345679',
          Paterno: '',
          Materno: 'DOE',
          Nombre: 'JONH',
          Promedio: 8
        }
      ],
      result: [
        {
          currentGroup: '100',
          enrollmentId: '12345678',
          paternalSurname: 'PEREZ',
          maternalSurname: 'LOPEZ',
          names: 'JUAN',
          grade: 10,
          type: 'STUDENT',
          email: '12345678@cobachih.edu.mx',
          shift: 'MORNING'
        },
        {
          currentGroup: '150',
          enrollmentId: '12345679',
          paternalSurname: '',
          maternalSurname: 'DOE',
          names: 'JONH',
          grade: 8,
          type: 'STUDENT',
          email: '12345679@cobachih.edu.mx',
          shift: 'EVENING'
        }
      ]
    },
    {
      descr: 'Incomplete data',
      error: true,
      parsedData: [
        {
          Grupo: '100',
          Matricula: '12345678',
          Nombre: 'JUAN',
          Promedio: 10
        },
        {
          Grupo: '150',
          Matricula: '12345679',
          Paterno: 'DOE',
          Materno: 'DOE',
          Nombre: 'JONH',
          Promedio: 8
        }
      ],
      result: 'Invalid Fields'
    },
    {
      descr: 'Wrong Data',
      error: true,
      parsedData: [
        {
          Grupo: '100',
          Matricula: '12345678',
          Age: 16,
          Paterno: 'PEREZ',
          Materno: 'LOPEZ',
          Nombre: 'JUAN',
          Promedio: 10
        },
        {
          Grupo: '150',
          Matricula: '12345679',
          Paterno: '',
          Materno: 'DOE',
          Nombre: 'JONH',
          Promedio: 8
        }
      ],
      result: 'Invalid Fields'
    }
  ])('$descr', ({ parsedData, result, error }) => {
    if(error){
      expect(() => csvFormatter(parsedData)).toThrowError(result)
    } else {
      expect(csvFormatter(parsedData)).toEqual(result)
    }
  })
})