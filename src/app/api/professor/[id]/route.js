import { NextResponse } from 'next/server'
import { Professor } from '~/app/api/entities'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import validatorFields from '~/app/api/libs/validatorFields'
import cleanerData from '~/app/api/libs/cleanerData'
import validatePermission from '~/app/api/libs/validatePermission'

export const GET = async (request, { params }) => {
  try {
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const hasPermission = await validatePermission({ entity: Professor, action: 'findUnique', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'professor',
      queryType: 'findUnique',
      filter: { id: Number(id) },
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
    const hasPermission = await validatePermission({ entity: Professor, action: 'update', request })
    const data = await request.json()
    if(hasPermission && validatorFields({ data, shape: Professor.shape })){
      const payload = await queryDB({
        entity: 'professor',
        queryType: 'update',
        filter: { id: Number(id) },
        data
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
    const hasPermission = await validatePermission({ entity: Professor, action: 'update', request })
    const data = await request.json()
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'professor',
      queryType: 'update',
      filter: { id: Number(id) },
      data
    })
    if(payload) {
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
    const hasPermission = await validatePermission({ entity: Professor, action: 'delete', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const payload = await queryDB({
      entity: 'professor',
      queryType: 'update',
      filter: { id: Number(id) },
      data: {
        active: false
      }
    })
    if(payload) {
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })  
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}