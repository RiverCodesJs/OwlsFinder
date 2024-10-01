import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params  

  try{
    const params = {
      entity: 'club',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    }
    const club = await query({ ...params })

    return NextResponse.json(club, { status: 200 })
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json({ error: 'Error fetching club' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const { name, description, images, videos, limit, schedule, professorId } = await request.json()

  if(!name, !description, !images, !videos, !limit, !schedule, !professorId){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const params = {
      entity: 'club',
      queryType: 'update',
      filter: { id: Number(id) },
      data: {
        name, 
        description, 
        images, 
        videos, 
        limit, 
        schedule, 
        professorId 
      },
    }
    const club = await query({ ...params })

    return NextResponse.json(club, { status: 200 })
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json({ error: 'Error updating club', message: error }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()

  try {
    const params = {
      entity: 'club',
      queryType: 'update',
      filter: { id: Number(id) },
      data: { ...partialUpdate },
    }

    const club = await query({ ...params })

    return NextResponse.json(club, { status: 200 })
  } catch (error) {
    console.error('Error updating package partially:', error)
    return NextResponse.json({ error: 'Error updating package partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'club',
      queryType: 'delete',
      filter: { id: Number(id) },
    }

    const club = await query({ ...params })
    
    return NextResponse.json(club, { message: 'Deleting club successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json({ error: 'Error deleting club' }, { status: 500 })
  }
}