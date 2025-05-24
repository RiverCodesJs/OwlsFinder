import { NextResponse } from 'next/server'
import { Student } from '~/app/api/entities'
import { parse } from 'papaparse'
import { validatePermission } from '~/app/api/libs/permissions'
import csvFormatter from '~/app/api/students/utils/csvFormatter'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import cleanerData from '~/app/api/libs/cleanerData'
import payloadFormatter from '~/app/api/utils/payloadFormatter'

export const POST = async request => {
  try {
    const hasPermission = await validatePermission({ entity: Student, action: 'create', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const csvFile = await request.text()
    if(csvFile) {
      const { data } = parse(csvFile, {
        header: true,
        skipEmptyLines: true,
      })
      const processedData = csvFormatter(data)
      const payloads = await queryDB({
        entity: 'user',
        queryType: 'createMany',
        data: processedData,
      })
      const response = payloadFormatter(payloads.map(payload => cleanerData({ payload })))
      return NextResponse.json(response, { status: 201 })  
    }
    return ERROR.INVALID_FIELDS()  
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}