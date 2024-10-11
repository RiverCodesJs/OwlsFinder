import { NextResponse } from 'next/server'
import { packageShape } from '~/app/api/utils/shapes'
import { authenticateToken } from '~/app/api/libs/auth'
import { Package } from '~/app/api/entities'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'create' })
    
    if(hasPermission){
      const data = await request.json()
      
      if (!packageShape().every(key => key in data)) {
        return ERROR.INVALID_FIELDS()
      }

      const newPackage = await query({
        entity: 'package',
        queryType: 'create',
        data: {
          ...data,
          subjects: data.subjects.map(({ id }) => id)
        }
      })


      return NextResponse.json(newPackage, { status: 201 })
    } else {
      return ERROR.FORBIDDEN()
    }

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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Package, action: 'findMany' })

    if(hasPermission){
      const response = await query({
        entity: 'package',
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