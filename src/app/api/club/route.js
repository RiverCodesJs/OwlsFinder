import { NextResponse } from 'next/server'
import { Club } from '~/app/api/entities'
import { validatePermission } from '~/app/api/libs/permissions'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import validatorFields from '~/app/api/libs/validatorFields'
import cleanerData from '~/app/api/libs/cleanerData'
import payloadFormatter from '~/app/api/utils/payloadFormatter'

export const POST = async request => {
  try {
    const hasPermission = await validatePermission({ entity: Club, action: 'create', request })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: Club.shape })){
      const { professor, ...partialData } = data
      const payload = await queryDB({
        entity: 'club',
        queryType: 'create',
        data: {
          ...partialData,
        },
        ...(professor ? { 
          relations: [{
            entity: 'professor',
            data: professor
          }] 
        } : {} )
      })
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 201 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const GET = async request => {
  try{
    const hasPermission = await validatePermission({ entity: Club, action: 'findMany', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payloads = await queryDB({
      entity: 'club',
      queryType: 'findMany',
    })
    if(payloads) {
      const response = payloadFormatter(payloads.map(payload => cleanerData({ payload })))
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}