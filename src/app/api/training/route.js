import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, shift, professor } = await request.json()

    if(!name || !description || !images || !videos || !limit || !shift){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const params = {
      entity: 'training',
      queryType: 'create',
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

    const newTraining = await query({ ...params })


    return NextResponse.json(newTraining, { status: 201 })
  } catch (error) {
    console.error('Training creation failed:', error)
    return NextResponse.json({ error: 'Training creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    const params = {
      entity: 'training',
      queryType: 'findMany',
    }

    const trainings = await query({ ...params })

    return NextResponse.json(trainings, { status: 200 })
  } catch (error) {
    console.error('Error fetching trainings:', error)
    return NextResponse.json({ error: 'Error fetching trainings' }, { status: 500 })
  }
}