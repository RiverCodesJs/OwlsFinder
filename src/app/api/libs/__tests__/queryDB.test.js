import { describe, it, expect, vi } from 'vitest'
import queryDB from '~/app/api/libs/queryDB'

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
            active: true
          },
          {
            id : 2,
            name: 'package2',
            subjects: [{ id: 1 }, { id: 2 }] ,
            created_at: 'created_at',
            updated_at: 'updated_at',
            active: true
          }
        ]),

        findUnique: ({ where }) => ({ 
          id: where.id, 
          name: 'package1', 
          subjects: [{ id: 1 }, { id: 2 }], 
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),
        
        create: ({ data }) => ({
          id: 1, 
          name: data.name,
          subjects: [{ id: 1 }, { id:2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        update:  ({ where, data }) => ({
          id: where.id,
          name: data.name,
          subjects: [{ id: 1 }, { id: 2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }),

        delete: ({ where }) => ({
          id: where.id,
          name: 'package1',
          subjects: [{ id: 1 }, { id: 2 }],
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        })
      }
    } 
  }
})

describe('queryDB libs wihtout createMany', () =>{
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
      result: [
        { 
          id: 1, 
          name: 'package1', 
          subjects: [
            { id: 1 }, { id: 2 }
          ], 
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }, 
        { 
          id: 2, 
          name: 'package2', 
          subjects: [
            { id: 1 }, { id: 2 }
          ], 
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }
      ],
    },
    {
      descr: 'Find Many case but the response is null',
      entity: 'package',
      queryType: 'findMany',
      filter: null, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: null,
      isEmpty: true
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
        subjects: [
          { id: 1 }, { id: 2 }
        ],
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: true
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
      result: null,
      isEmpty: true
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
        subjects: [
          { id: 1 }, { id: 2 }
        ],
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: true
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
        subjects: [
          { id: 1 }, { id: 2 }
        ],
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: true
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
      isEmpty: true,
      result: null,
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
        subjects: [
          { id: 1 }, { id: 2 }
        ],
        created_at: 'created_at',
        updated_at: 'updated_at',
        active: true
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
      isEmpty: true,
      result: null,
    }
  ])('$descr', async ({ result, error, mockImplementation, isEmpty, queryType, ...props }) => {
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, queryType).mockReturnValueOnce(null) 
      expect(async () => await queryDB({ queryType, ...props })).rejects.toThrowError(result)
    } else if(error) {
      expect(async () => await queryDB({ queryType, ...props })).rejects.toThrowError(result)
    } else if(isEmpty) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, queryType).mockReturnValueOnce(queryType === 'findMany' ? [] : null) 
      expect(await queryDB({ queryType, ...props })).toEqual(result)
    } else {
      expect(await queryDB({ queryType, ...props })).toEqual(result)
    }
  })
})

describe('queryDB libs just createMany', () => {
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
      result: [
        {
          id: 1,
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        },
        {
          id: 2,
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }
      ],
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
      result: [
        {
          id: 3,
          names: 'Carlos Alberto',
          email: '23080001@cobachih.edu.mx',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        },
        {
          id: 4,
          names: 'Maria Fernanda',
          email: '23080002@cobachih.edu.mx',
          created_at: 'created_at',
          updated_at: 'updated_at',
          active: true
        }
      ],
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
      
      expect(async () => await queryDB({ ...props })).rejects.toThrowError(result)

    } else {
      if (newData) {
        const db = await import('~/app/api/libs/db')
        props.data.forEach(() => vi.spyOn(db.default.user, 'findUnique').mockReturnValueOnce(null) )
        expect(await queryDB({ ...props })).toEqual(result)
      } else {
        expect(await queryDB({ ...props })).toEqual(result)
      }
    }

  })
})