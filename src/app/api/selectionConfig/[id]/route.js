import { NextResponse } from 'next/server'
import { SelectionConfig } from '~/app/api/entities'
import { validatePermission } from '~/app/api/libs/permissions'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import cleanerData from '~/app/api/libs/cleanerData'
import validatorFields from '~/app/api/libs/validatorFields'

export const GET = async (request, { params }) => {
  try {
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const hasPermission = await validatePermission({ entity: SelectionConfig, action: 'findUnique', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'selectionConfig',
      queryType: 'findUnique',
      filter: { id: Number(id) },
      includes: ['packageSelection', 'trainingSelection'],
      createdAt: true
    })
    if(payload){
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async (request, { params }) => {
  try{
    const { id } = params
    const hasPermission = await validatePermission({ entity: SelectionConfig, action: 'update', request })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: SelectionConfig.shape })){
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
      if(payload){
        const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
        return NextResponse.json(response, { status: 200 })
      } 
      return ERROR.NOT_FOUND()
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params
    const hasPermission = await validatePermission({ entity: SelectionConfig, action: 'delete', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'selectionConfig',
      queryType: 'delete',
      filter: { id: Number(id) },
      createdAt: true,
      includes: ['packageSelection', 'trainingSelection'],
    })
    if(payload){
      const response = cleanerData({ payload, includes:['packageSelection', 'trainingSelection'], createdAt: true })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}