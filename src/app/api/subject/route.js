import { NextResponse } from 'next/server'
import { subjectShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Subject } from '~/app/api/entities'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Subject, action: 'create' })
    if(hasPermission){
      const data = await request.json()
      if (!subjectShape().every(key => key in data)) {
        return ERROR.INVALID_FIELDS()
      }
      const response = await query({
        entity: 'subject',
        queryType: 'create',
        data
      })
      return NextResponse.json(response, { status: 201 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const GET = async request => {
  try{
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Subject, action: 'findMany' })
    if(hasPermission){
      const response = await query({
        entity: 'subject',
        queryType: 'findMany',
      })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}