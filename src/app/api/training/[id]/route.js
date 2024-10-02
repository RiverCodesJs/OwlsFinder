import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'training',
      queryType: 'findUnique',
      filter : { id: Number(id) }
    }

    const training = await query({ ...params })

    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error fetching training:', error)
    return NextResponse.json({ error: 'Error fetching training' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const { name, description, images, videos, limit, shift, professor } = await request.json()

  if(!name || !description || !images || !videos || !limit || !shift){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  try{
    const params = {
      entity: 'training',
      queryType: 'update',
      filter : { id: Number(id) },
      data: {
        name, 
        description, 
        images, 
        videos, 
        limit, 
        shift, 
        professor
      },
    }

    const training = await query({ ...params })

    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error updating training:', error)
    return NextResponse.json({ error: 'Error updating training' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()

  try {
    const params = {
      entity: 'training',
      queryType: 'update',
      filter : { id: Number(id) },
      data: { ...partialUpdate },
    }

    const training = await query({ ...params })

    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error updating training partially:', error)
    return NextResponse.json({ error: 'Error updating training partially' }, { status: 500 })
  }
}


export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'training',
      queryType: 'delete',
      filter : { id: Number(id) }
    }

    const training = await query({ ...params })
    
    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error deleting training:', error)
    return NextResponse.json({ error: 'Error deleting training' }, { status: 500 })
  }
}