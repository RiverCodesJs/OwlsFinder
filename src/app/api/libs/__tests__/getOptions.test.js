import { describe, it, expect } from 'vitest'
import { getOptions } from '~/app/api/libs/query'

describe('getOptions libs', () =>{
  it.each([
    {
      descr: 'Empty data',
      filter: null, 
      includes: null, 
      data: null, 
      relatrions: null,
      result: {}
    },
    {
      descr: 'Has just filter',
      filter: { id: 1 }, 
      includes: null, 
      data: null, 
      relations: null,
      result: { where: { id: 1 } }
    },
    {
      descr: 'Has just includes',
      filter: null, 
      includes: ['subjects'], 
      data: null, 
      relations: null,
      result: { 
        include: {
          subjects: {
            select:{
              id: true,
            }
          }
        } 
      }
    },
    {
      descr: 'Has just data',
      filter: null, 
      includes: null, 
      data: {
        name: 'John',
        lastName: 'Doe'
      }, 
      relations: null,
      result: { 
        data: {
          name: 'John',
          lastName: 'Doe'
        }
      } 
    },
    {
      descr: 'Has data, includes and relaions',
      filter: null, 
      includes: ['subjects'], 
      data: {
        name: 'John',
        lastName: 'Doe'
      }, 
      relations: [
        {
          entity: 'subjects',
          data: [
            {
              id: 1,
              name: 'Math',
              description: 'Description of Math Subject'
            },
            {
              name: 'Calculus',
              description: 'Description of Calculus Subject'
            },
          ]
        }
      ],
      result: { 
        data: {
          name: 'John',
          lastName: 'Doe',
          subjects: {
            connectOrCreate: [
              {
                create:  {
                  id: 1,
                  name: 'Math',
                  description: 'Description of Math Subject'
                },
                where:  {
                  id: 1,
                },
              },
              {
                create:  {
                  name: 'Calculus',
                  description: 'Description of Calculus Subject'
                },
                where:  {
                  id: 0,
                },
              },
            ],
          },
        },
        include: {
          subjects: {
            select:{
              id: true,
            }
          }
        },
      } 
    },
    {
      descr: 'Has data, includes and one relaion',
      filter: null, 
      includes: ['subjects', 'permissions'], 
      data: {
        name: 'John',
        lastName: 'Doe'
      }, 
      relations: [
        {
          entity: 'subjects',
          data: {
            name: 'Math',
            description: 'Description of Math Subject'
          },
        }
      ],
      result: { 
        data: {
          name: 'John',
          lastName: 'Doe',
          subjects: {
            connectOrCreate:{
              create:  {
                name: 'Math',
                description: 'Description of Math Subject'
              },
              where:  {
                id: 0,
              },
            },
          },
        },
        include: {
          subjects: {
            select:{
              id: true,
            }
          },
          permissions:{
            select:{
              name: true,
            }
          }
        },
      } 
    },

  ])('$descr', ({ filter, includes, data, relations, result }) => {
    expect(getOptions({ filter, includes, data, relations })).toEqual(result)
  })
})