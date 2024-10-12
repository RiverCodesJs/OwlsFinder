import { describe, it, expect, vi } from 'vitest'
import query from '~/app/api/libs/query'

vi.mock('~/app/api/libs/db', () => {
  return {
    default: {
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

describe('query libs', () =>{
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
          subjects: [1, 2] 
        }, 
        2: { 
          id: 2, 
          name: 'package2', 
          subjects: [1, 2] 
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
        subjects: [1, 2] 
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
        subjects: [1, 2] 
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
        subjects: [1, 2] 
      }
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
        subjects: [1, 2] 
      }
    }
  ])('$descr', async ({ result, mockImplementation, queryType, ...props }) => {
    if (mockImplementation) {
      const db = await import('~/app/api/libs/db')
      vi.spyOn(db.default.package, queryType).mockReturnValueOnce(null) 
      expect(async () => await query({ queryType, ...props })).rejects.toThrowError(result)

    } else {
      expect(await query({ queryType, ...props })).toEqual(result)
    }

  })
})