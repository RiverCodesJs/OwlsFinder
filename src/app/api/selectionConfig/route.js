import { NextResponse } from 'next/server'
import { selectionConfigShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { SelectionConfig } from '~/app/api/entities'
import ERROR from '~/error'
import query from '~/app/api/libs/query'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'

export const POST = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await query({
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
      const response = await query({
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
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: SelectionConfig, action: 'findMany' })
    if(hasPermission){
      const response = await query({
        entity: 'selectionConfig',
        queryType: 'findMany',
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