import { NextResponse } from 'next/server'
import { packageShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Package } from '~/app/api/entities'
import ERROR from '~/error'
import query from '~/app/api/libs/query'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'


export const GET = async (request, { params }) => {
  try {
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'create' })

    if(hasPermission){
      const pack = await query({
        entity: 'package',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
      return NextResponse.json(pack, { status: 200 })
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'update' })
    const data = await request.json()
    
    if(hasPermission){

      if (!packageShape().every(key => key in data)) {
        return ERROR.INVALID_FIELDS()
      }

      await query({
        entity: 'package',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })

      const pack = await query({
        entity: 'package',
        queryType: 'update',
        filter: { id: Number(id) },
        data: {
          ...data,
          subjects: data.subjects.map(({ id }) => id)
        }
      })
  
      return NextResponse.json(pack, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async (request, { params }) => {
  try {
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'update' })

    if(hasPermission){
      const data = await request.json()
      
      await query({
        entity: 'package',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
  
      const pack = await query({
        entity: 'package',
        queryType: 'update',
        filter: { id: Number(id) },
        data: {
          ...data,
          subjects: data.subjects?.map(({ id }) => id)
        }
      })
  
      return NextResponse.json(pack, { status: 200 })
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'delete' })

    if(hasPermission){
      await query({
        entity: 'package',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
      const pack = await query({
        entity: 'package',
        queryType: 'delete',
        filter: { id: Number(id) },
      })
      
      return NextResponse.json(pack, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}