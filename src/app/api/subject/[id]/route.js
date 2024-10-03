import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'subject',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    }
    const subject = await query({ ...params })

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json({ error: 'Error fetching subject' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const { name, description } = await request.json()

  if(!name || !description){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const params = {
      entity: 'subject',
      queryType: 'update',
  
      filter: { id: Number(id) },
      data: {
        name,
        description,
      }
    }
    const subject = await query({ ...params })

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Error updating subject' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()

  try {
    const params = {
      entity: 'subject',
      queryType: 'update',
      filter: { id: Number(id) },
      data: { ...partialUpdate },
    

    }
    const subject = await query({ ...params })

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error updating subject partially:', error)
    return NextResponse.json({ error: 'Error updating subject partially' }, { status: 500 })
  }
}


export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'subject',
      queryType: 'delete',
      filter: { id: Number(id) },
    }

    const subject = await query({ ...params })
    
    return NextResponse.json(subject, { message: 'Deleting subject successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Error deleting subject' }, { status: 500 })
  }
}