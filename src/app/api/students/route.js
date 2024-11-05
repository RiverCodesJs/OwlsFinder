import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'
import { Students } from '~/app/api/entities'
import csvFormatter from '~/app/api/students/utils/csvFormatter'
import ERROR from '~/error'
import Papa from 'papaparse'
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
    const hasPermission = getPermissionsByEntity({ permissions, entity: Students, action: 'create' })
    if(hasPermission){
      const csvFile = await request.text()
      if(!csvFile) return ERROR.INVALID_FIELDS()
      const { data } = Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
      })
      const processedData = csvFormatter(data)
      const response = await query({
        entity: 'user',
        queryType: 'createMany',
        data: processedData,
      })
      return NextResponse.json(response, { status: 201 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
