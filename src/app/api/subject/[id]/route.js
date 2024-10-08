import { NextResponse } from 'next/server'
import query from '~/app/api/libs/query'
import { subjectShape } from '~/app/api/utils/shapes'

export const GET = async ({ params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'subject',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    }
    const subject = await query(params)

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const data = await request.json()

  if (!subjectShape().every(key => key in data)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const params = {
      entity: 'subject',
      queryType: 'update',
      filter: { id: Number(id) },
      data
    }
    const subject = await query(params)

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const subject = await query(params)

    return NextResponse.json(subject, { status: 200 })
  } catch (error) {
    console.error('Error updating subject partially:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export const DELETE = async ({ params }) => {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}