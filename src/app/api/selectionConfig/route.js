import { NextResponse } from 'next/server'
import { selectionConfigShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { SelectionConfig } from '~/app/api/entities'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import cleanerData from '~/app/api/libs/cleanerData'
import payloadFormatter from '~/app/api/utils/payloadFormatter'

export const POST = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'create' })
    if(hasPermission){
      const data = await request.json()
      if (!selectionConfigShape.every(key => key in data)) return ERROR.INVALID_FIELDS()
      const { packageSelection, trainingSelection, ...partialData } = data
      const payload = await queryDB({
        entity: 'selectionConfig',
        queryType: 'create',
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
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
      return NextResponse.json(response, { status: 201 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const GET = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'findMany' })
    if(hasPermission){
      const payloads = await queryDB({
        entity: 'selectionConfig',
        queryType: 'findMany',
        includes: ['packageSelection', 'trainingSelection'],
        createdAt: true
      })
      if(!payloads) return ERROR.NOT_FOUND()
      const response = payloadFormatter(payloads.map(payload => cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })))
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
    
  }
}