import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'professor',
      queryType: 'findUnique',
      includes: ['clubs'],
      filter: { id: Number(id) }
    }
    const professor = await query({ ...params })

    return NextResponse.json(professor, { status: 200 })
  } catch (error) {
    console.error('Error fetching professor:', error)
    return NextResponse.json({ error: 'Error fetching professor' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  
  const { name, paternalSurname, maternalSurname, email, club } = await request.json()
     
  if(!name || !paternalSurname || !maternalSurname || !email || !id){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const relations = club ? ([{
      entity: 'clubs',
      data: club 
    }]) : undefined

    const params = {
      entity: 'professor',
      queryType: 'update',
      includes: ['clubs'],
      filter: { id: Number(id) },
      data: {
        name,
        paternalSurname, 
        maternalSurname, 
        email
      },
      relations
    }

    const professor = await query({ ...params })

    return NextResponse.json(professor, { status: 200 })
  } catch (error) {
    console.error('Error updating professor:', error)
    return NextResponse.json({ error: 'Error updating professor' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const { club, ...partialUpdate } = await request.json()

  try {
    const relations = club ? ([{
      entity: 'clubs',
      data: club 
    }]) : undefined

    const params = {
      entity: 'professor',
      queryType: 'update',
      includes: ['clubs'],
      filter: { id: Number(id) },
      data: { ...partialUpdate },
      relations
    }

    const professor = await query({ ...params })

    return NextResponse.json(professor, { status: 200 })
  } catch (error) {
    console.error('Error updating professor partially:', error)
    return NextResponse.json({ error: 'Error updating professor partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {

    const params = {
      entity: 'professor',
      queryType: 'delete',
      includes: ['clubs'],
      filter: { id: Number(id) },
    }
    
    const professor = await query({ ...params })

    return NextResponse.json(professor, { status: 200 })
  } catch (error) {
    console.error('Error deleting professor:', error)
    return NextResponse.json({ error: 'Error deleting professor' }, { status: 500 })
  }
}