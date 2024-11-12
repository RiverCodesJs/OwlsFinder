import { NextResponse } from 'next/server'
import { selectionConfigShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { SelectionConfig } from '~/app/api/entities'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import cleanerData from '~/app/api/libs/cleanerData'

export const GET = async (request, { params }) => {
  try {
    const { id } = params
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'findUnique' })
    if(hasPermission){
      const payload = await queryDB({
        entity: 'selectionConfig',
        queryType: 'findUnique',
        filter: { id: Number(id) },
        includes: ['packageSelection', 'trainingSelection'],
        createdAt: true
      })
      if(!payload) return ERROR.NOT_FOUND()
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
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
    const { permissions } = await queryDB({
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
      const payload = await queryDB({
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
      if(!payload) return ERROR.NOT_FOUND()
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
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
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions'],
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'delete' })
    if(hasPermission){
      const payload = await queryDB({
        entity: 'selectionConfig',
        queryType: 'delete',
        filter: { id: Number(id) },
        createdAt: true,
        includes: ['packageSelection', 'trainingSelection'],
      })
      if(!payload) return ERROR.NOT_FOUND()
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}