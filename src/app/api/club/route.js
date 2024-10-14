import { NextResponse } from 'next/server'
import { clubShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Club } from '~/app/api/entities'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'create' })
    
    if(hasPermission){
      const data = await request.json()
      
      if (!clubShape().every(key => key in data)) {
        return ERROR.INVALID_FIELDS()
      }

      const { professor, ...partialData } = data

      const response = await query({
        entity: 'club',
        queryType: 'create',
        data: {
          ...partialData,
        },
        relations: [{
          entity: 'professor',
          data: professor
        }]
      })

      return NextResponse.json(response, { status: 201 })
    } else {
      return ERROR.FORBIDDEN()
    }

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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Club, action: 'findMany' })

    if(hasPermission){
      const response = await query({
        entity: 'club',
        queryType: 'findMany',
      })
      return NextResponse.json(response, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
