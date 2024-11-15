import { NextResponse } from 'next/server'
import { SelectionConfig } from '~/app/api/entities'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import cleanerData from '~/app/api/libs/cleanerData'
import payloadFormatter from '~/app/api/utils/payloadFormatter'
import validatorFields from '~/app/api/libs/validatorFields'
import validatePermission from '~/app/api/libs/validatePermission'

export const POST = async request => {
  try {
    const hasPermission = await validatePermission({ entity: SelectionConfig, action: 'create', request })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: SelectionConfig.shape })){
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
    const hasPermission = await validatePermission({ entity: SelectionConfig, action: 'findMany', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payloads = await queryDB({
      entity: 'selectionConfig',
      queryType: 'findMany',
      includes: ['packageSelection', 'trainingSelection'],
      createdAt: true
    })
    if(payloads){
      const response = payloadFormatter(
        payloads.map(payload => cleanerData({ 
          payload, 
          includes:['packageSelection', 'trainingSelection'], 
          createdAt: true 
        })))
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
    
  }
}