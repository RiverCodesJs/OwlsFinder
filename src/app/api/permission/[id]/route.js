import { NextResponse } from 'next/server'
import { Permission } from '~/app/api/entities'
import { validatePermission } from '~/app/api/libs/permissions'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import validatorFields from '~/app/api/libs/validatorFields'
import cleanerData from '~/app/api/libs/cleanerData'

export const GET = async (request, { params }) => {
  try{
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const hasPermission = await validatePermission({ entity: Permission, action: 'findUnique', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'permission',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    })
    if(payload){
      const response = cleanerData({ payload })
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
    const hasPermission = await validatePermission({ entity: Permission, action: 'update', request })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: Permission.shape })){
      const payload = await queryDB({
        entity: 'permission',
        queryType: 'update',
        filter: { id: Number(id) },
        data,
      })
      if(!payload) return ERROR.NOT_FOUND()
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async (request, { params }) => {
  try{
    const { id } = params
    const hasPermission = await validatePermission({ entity: Permission, action: 'update', request })
    const data = await request.json()
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'permission',
      queryType: 'update',
      filter: { id: Number(id) },
      data,
    })
    if(payload){
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })    
    } 
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params
    const hasPermission = await validatePermission({ entity: Permission, action: 'delete', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'permission',
      queryType: 'delete',
      filter: { id: Number(id) },
    })
    if(!payload) return ERROR.NOT_FOUND()
    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}