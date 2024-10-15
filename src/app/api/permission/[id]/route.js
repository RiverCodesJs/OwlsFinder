import { NextResponse } from 'next/server'
import { permissionShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Permission } from '~/app/api/entities'
import ERROR from '~/error'
import query from '~/app/api/libs/query'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'

export const GET = async (request, { params }) => {
  try{
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Permission, action: 'findUnique' })

    if(hasPermission){
      const response = await query({
        entity: 'permission',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
      return NextResponse.json(response, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async (request, { params }) => {
  try{
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Permission, action: 'update' })
    const data = await request.json()
    
    if(hasPermission){
      if (!permissionShape().every(key => key in data)) {
        return ERROR.INVALID_FIELDS()
      }
      await query({
        entity: 'permission',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })

      const response = await query({
        entity: 'permission',
        queryType: 'update',
        filter: { id: Number(id) },
        data,
      })
  
      return NextResponse.json(response, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async (request, { params }) => {
  try{
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Permission, action: 'update' })
    const data = await request.json()
    
    if(hasPermission){
      await query({
        entity: 'permission',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })

      const response = await query({
        entity: 'permission',
        queryType: 'update',
        filter: { id: Number(id) },
        data,
      })
  
      return NextResponse.json(response, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Permission, action: 'delete' })

    if(hasPermission){
      await query({
        entity: 'permission',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
      const response = await query({
        entity: 'permission',
        queryType: 'delete',
        filter: { id: Number(id) },
      })
      
      return NextResponse.json(response, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}