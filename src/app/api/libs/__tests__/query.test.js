import { describe, it, expect, vi } from 'vitest'
import query from '~/app/api/libs/query'

let id = 1

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
      user:{
        findUnique: ({ where }) => ({ 
          email: where.email,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        update:  ({ data }) => ({
          id: id++,
          names: data.names || 'Jonh',
          email: data.email || 'jonh.doe@gmail.com',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        create: ({ data }) => ({
          id: id++, 
          names: data.names,
          email: data.email,
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
      },
      
      package: {
        findMany: () => ([
          { 
            id: 1,
            name: 'package1',
            subjects: [{ id: 1 }, { id: 2 }],
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
            
          },
          {
            id : 2,
            name: 'package2',
            subjects: [{ id: 1 }, { id: 2 }] ,
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: 'active'
          }
        ]),

        findUnique: ({ where }) => ({ 
          id: where.id, 
          name: 'package1', 
          subjects: [{ id: 1 }, { id: 2 }], 
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),
        
        create: ({ data }) => ({
          id: 1, 
          name: data.name,
          subjects: [{ id: 1 }, { id:2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),

        update:  ({ where, data }) => ({
          id: where.id,
          name: data.name,
          subjects: [{ id: 1 }, { id: 2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        }),

        delete: ({ where }) => ({
          id: where.id,
          name: 'package1',
          subjects: [{ id: 1 }, { id: 2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: 'active'
        })
      }
    } 
  }
})

describe('query libs wihtout createMany', () =>{
  it.each([
    {
      descr: 'Empty data',
      entity: null,
      queryType: null,
      filter: null, 
      includes: null, 
      data: null, 
      relations: null,
      result: null
    },
    {
      descr: 'Find Many case',
      entity: 'package',
      queryType: 'findMany',
      filter: null, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: {
        1: { 
          id: 1, 
          name: 'package1', 
          subjects: [1, 2], 
          active: 'active'
        }, 
        2: { 
          id: 2, 
          name: 'package2', 
          subjects: [1, 2],
          active: 'active' 
        } 
      },
    },
    {
      descr: 'Find Many case but the response is null',
      entity: 'package',
      queryType: 'findMany',
      filter: null, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: 'Not Found',
      mockImplementation: true
    },
    {
      descr: 'Find Unique case',
      entity: 'package',
      queryType: 'findUnique',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: {
        id: 1, 
        name: 'package1', 
        subjects: [1, 2],
        active: 'active'
      },
    },
    {
      descr: 'Find Unique case but the response is null',
      entity: 'package',
      queryType: 'findUnique',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: 'Not Found',
      mockImplementation: true
    },
    {
      descr: 'Find Unique case but the id is a NaN',
      entity: 'package',
      queryType: 'findUnique',
      filter: { id: NaN }, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      error: true,
      result: 'Not Found',
    },
    {
      descr: 'Create case',
      entity: 'package',
      queryType: 'create',
      filter: null, 
      includes: ['subjects'], 
      data: {
        name: 'package1'
      }, 
      relations: [{
        entity: 'subjects',
        data: [
          {
            id: 1,
            name: 'subject1'
          },
          {
            name: 'subject2'
          }
        ]
      }],
      result: {
        id: 1, 
        name: 'package1', 
        subjects: [1, 2],
        active: 'active'
      },
    },
    {
      descr: 'Update case',
      entity: 'package',
      queryType: 'update',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: {
        name: 'packageUpdated'
      }, 
      relations: null,
      result: {
        id: 1, 
        name: 'packageUpdated', 
        subjects: [1, 2],
        active: 'active'
      }
    },
    {
      descr: 'Update case but the element to modify does not exist',
      entity: 'package',
      queryType: 'update',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: {
        name: 'packageUpdated'
      }, 
      relations: null,
      error: 'findUnique',
      result: 'Not Found',
    },
    {
      descr: 'Delete case',
      entity: 'package',
      queryType: 'delete',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: null,
      relations: null,
      result: {
        id: 1, 
        name: 'package1', 
        subjects: [1, 2],
        active: 'active'
      }
    },
    {
      descr: 'Delete case but the element to modify does not exist',
      entity: 'package',
      queryType: 'delete',
      filter: { id: 1 }, 
      includes: ['subjects'], 
      data: null,
      relations: null,
      error: 'findUnique',
      result: 'Not Found',
    }
  ])('$descr', async ({ result, error, mockImplementation, queryType, ...props }) => {
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, queryType).mockReturnValueOnce(null) 
      expect(async () => await query({ queryType, ...props })).rejects.toThrowError(result)
    } else if(error) {
      if(error === 'findUnique'){
        const db = await import('~/app/api/libs/db')
        vi.spyOn(db.default.package, 'findUnique').mockReturnValueOnce(null)
      } 
      expect(async () => await query({ queryType, ...props })).rejects.toThrowError(result)
    } else {
      expect(await query({ queryType, ...props })).toEqual(result)
    }
  })
})

describe('query libs just createMany', () => {
  it.each([
    {
      descr: 'createMany case - new data',
      entity: 'user',
      queryType: 'createMany',
      newData: true,
      data: [
        {
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
        },
        {
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
        }
      ], 
      result: {
        1: {
          id: 1,
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
          active: true
        },
        2:{
          id: 2,
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
          active: true
        }
      },
    },
    {
      descr: 'createMany case - no new data',
      entity: 'user',
      queryType: 'createMany',
      newData: false,
      data: [
        {
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
        },
        {
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
        }
      ], 
      result: {
        3: {
          id: 3,
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
          active: true
        },
        4:{
          id: 4,
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
          active: true
        }
      },
    },
    {
      descr: 'createMany case - no new data',
      entity: 'user',
      queryType: 'createMany',
      newData: false,
      mockImplementation: new Error('Error fetching user'),
      data: [
        {
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
        },
        {
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
        }
      ], 
      result: 'Error fetching user',
    },
  ])('$descr', async ({ result, newData, mockImplementation, ...props }) => {
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation)
      
      expect(async () => await query({ ...props })).rejects.toThrowError(result)

    } else {
      if (newData) {
        const db = await import('~/app/api/libs/db')
        props.data.forEach(() => vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null) )
        expect(await query({ ...props })).toEqual(result)
      } else {
        expect(await query({ ...props })).toEqual(result)
      }
    }

  })
})