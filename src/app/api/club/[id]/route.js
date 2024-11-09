import { NextResponse } from 'next/server'
import { clubShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Club } from '~/app/api/entities'
import ERROR from '~/error'
import query from '~/app/api/libs/query'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import validatorFields from '~/app/api/libs/validatorFields'

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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'findUnique' })
    if(hasPermission){
      const response = await query({
        entity: 'club',
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'update' })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: clubShape })){
      const { professor, ...partialData } = data
      const response = await query({
        entity: 'club',
        queryType: 'update',
        filter: { id: Number(id) },
        data: {
          ...partialData,
          professorId: professor ? professor.id : data.professorId
        }
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'update' })
    if(hasPermission){
      const data = await request.json()
      const { professor, ...partialData } = data
      const response = await query({
        entity: 'club',
        queryType: 'update',
        filter: { id: Number(id) },
        data: {
          ...partialData,
          ...(professor ? { professorId: professor.id } : {})
        }
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'delete' })
    if(hasPermission){
      const response = await query({
        entity: 'club',
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