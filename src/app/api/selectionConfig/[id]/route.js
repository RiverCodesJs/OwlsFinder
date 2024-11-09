import { NextResponse } from 'next/server'
import { selectionConfigShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { SelectionConfig } from '~/app/api/entities'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'findUnique' })
    if(hasPermission){
      const response = await query({
        entity: 'selectionConfig',
        queryType: 'findUnique',
        filter: { id: Number(id) },
        includes: ['packageSelection', 'trainingSelection'],
        createdAt: true
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'update' })
    const data = await request.json()
    if(hasPermission){
      if (!selectionConfigShape.every(key => key in data)) return ERROR.INVALID_FIELDS()
      const { packageSelection, trainingSelection, ...partialData } = data
      const response = await query({
        entity: 'selectionConfig',
        queryType: 'update',
        filter: { id: Number(id) },
        data: partialData,
        createdAt: true,
        includes: ['packageSelection', 'trainingSelection'],
        relations: [
          {
            entity: 'packageSelection',
            data: packageSelection
          },
          {
            entity: 'trainingSelection',
            data: trainingSelection
          }
        ]
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
      includes: ['permissions'],
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'delete' })
    if(hasPermission){
      const response = await query({
        entity: 'selectionConfig',
        queryType: 'delete',
        filter: { id: Number(id) },
        createdAt: true,
        includes: ['packageSelection', 'trainingSelection'],
      })    
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}