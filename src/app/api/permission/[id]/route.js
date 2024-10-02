import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'permission',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    }
    const permission = await query({ ...params })

    return NextResponse.json(permission, { status: 200 })
  } catch (error) {
    console.error('Error fetching permission:', error)
    return NextResponse.json({ error: 'Error fetching permission' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const { name } = await request.json()

  if(!name){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const params = {
      entity: 'permission',
      queryType: 'update',
      filter: { id: Number(id) },
      data:{
        name
      }
    }

    const permission = await query({ ...params })

    return NextResponse.json(permission, { status: 200 })
  } catch (error) {
    console.error('Error updating permission:', error)
    return NextResponse.json({ error: 'Error updating permission' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()

  try {
    const params = {
      entity: 'permission',
      queryType: 'update',
      filter: { id: Number(id) },
      data:{ ...partialUpdate }
    }

    const permission = await query({ ...params })

    return NextResponse.json(permission, { status: 200 })
  } catch (error) {
    console.error('Error updating permission partially:', error)
    return NextResponse.json({ error: 'Error updating permission partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'permission',
      queryType: 'delete',
      filter: { id: Number(id) },
    }

    const permission = await query({ ...params })
    
    return NextResponse.json(permission, { message: 'Permission deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json({ error: 'Error deleting permission' }, { status: 500 })
  }
}