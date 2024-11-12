import { describe, it, expect } from 'vitest'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'

describe('permissionsByEntity libs', () =>{
  it.each([
    {
      descr: 'Empty data',
      permissions: null,
      entity: null,
      action: null,
      result: false
    },
    {
      descr: 'Has permissions related to the entity',
      permissions: [
        { name: 'create_package' },
        { name: 'update_package' },
        { name: 'delete_package' },
        { name: 'create_club' },
        { name: 'update_club' },
        { name: 'delete_club' }
      ],
      entity: {
        name: 'club',
        permissions: {
          create: true,
          update: true,
          delete: true
        }
      },
      action: 'create',
      result: true
    },
    {
      descr: 'Has permissions which are not related to the entity',
      permissions: [
        { name: 'create_package' },
        { name: 'update_package' },
        { name: 'delete_package' },
        { name: 'create_club' },
        { name: 'update_club' },
        { name: 'delete_club' }
      ],
      entity: {
        name: 'training',
        permissions: {
          create: true,
          update: true,
          delete: true
        }
      },
      action: 'create',
      result: false
    },
    {
      descr: 'Has not permission but the permission is not requiered',
      permissions: [
        { name: 'create_package' },
        { name: 'update_package' },
        { name: 'delete_package' },
        { name: 'create_club' },
        { name: 'update_club' },
        { name: 'delete_club' }
      ],
      entity: {
        name: 'club',
        permissions: {
          create: true,
          update: true,
          delete: true
        }
      },
      action: 'findUnique',
      result: true
    }
  ])('$descr', ({ permissions, entity, action, result }) => {
    expect(getPermissionsByEntity({ permissions, entity, action })).toEqual(result)
  })
})