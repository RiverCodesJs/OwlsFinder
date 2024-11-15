import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'
import { Me } from '~/app/api/entities'
import ERROR from '~/error'
import queryDB from '~/app/api/libs/queryDB'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import bcrypt from 'bcrypt'
import validatorFields from '~/app/api/libs/validatorFields'
import cleanerData from '~/app/api/libs/cleanerData'

export const GET = async request => {
  try {
    const userId = authenticateToken(request)
    const payload = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions: payload.permissions, entity: Me, action: 'findUnique' })
    if(hasPermission){
      const response = cleanerData({ payload, includes: ['permissions'] })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'update' })
    const { password, ...data } = await request.json()
    if(hasPermission && validatorFields({ data, shape: Me.shape })){
      const payload = await queryDB({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        includes: ['permissions'],
        data: {
          ...data,
          ...(password ? { password: await bcrypt.hash(password, 12) } : {})
        }
      })
      const response = cleanerData({ payload, includes: ['permissions'] })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'update' })
    if(hasPermission){
      const { password, ...data } = await request.json()
      const payload = await queryDB({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        includes: ['permissions'],
        data: {
          ...data,
          ...(password ? { password: await bcrypt.hash(password, 12) } : {})
        }
      })
      const response = cleanerData({ payload, includes: ['permissions'] })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Me, action: 'delete' })
    if(hasPermission){
      const payload = await queryDB({
        entity: 'user',
        queryType: 'update',
        filter: { id: Number(userId) },
        data: {
          active: false
        }
      })
      const response = cleanerData({ payload, includes: ['permissions'] })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}