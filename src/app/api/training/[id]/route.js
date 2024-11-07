import { NextResponse } from 'next/server'
import { trainingShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Training } from '~/app/api/entities'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Training, action: 'findUnique' })
    if(hasPermission){
      const response = await query({
        entity: 'training',
        queryType: 'findUnique',
        filter: { id: Number(id) }
      })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Training, action: 'update' })
    if(hasPermission){
      const data = await request.json()
      if (!trainingShape().every(key => key in data)) return ERROR.INVALID_FIELDS()
      const response = await query({
        entity: 'training',
        queryType: 'update',
        filter: { id: Number(id) },
        data
      })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Training, action: 'update' })
    if(hasPermission){
      const data = await request.json()
      const response = await query({
        entity: 'training',
        queryType: 'update',
        filter: { id: Number(id) },
        data
      })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Training, action: 'delete' })
    if(hasPermission){
      const response = await query({
        entity: 'training',
        queryType: 'update',
        filter: { id: Number(id) },
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