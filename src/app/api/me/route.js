import { NextResponse } from 'next/server'
import { meShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Me } from '~/app/api/entities'
import ERROR from '~/error'
import query from '~/app/api/libs/query'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import bcrypt from 'bcrypt'
import validatorFields from '~/app/api/libs/validatorFields'

export const GET = async request => {
  try {
    const userId = authenticateToken(request)
    const response = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions: response.permissions, entity: Me, action: 'findUnique' })
    if(hasPermission){
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'update' })
    const { password, ...data } = await request.json()
    if(hasPermission && validatorFields({ data, shape: meShape })){
      const response = await query({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        includes: ['permissions'],
        data: {
          ...data,
          ...(password ? { password: await bcrypt.hash(password, 12) } : {})
        }
      })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'update' })
    if(hasPermission){
      const { password, ...data } = await request.json()
      const response = await query({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        includes: ['permissions'],
        data: {
          ...data,
          ...(password ? { password: await bcrypt.hash(password, 12) } : {})
        }
      })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'delete' })
    if(hasPermission){
      const response = await query({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        data: {
          active: false
        }
      })    
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}