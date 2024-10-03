import { NextResponse } from 'next/server'
import query from '~/libs/query'
import bcrypt from 'bcrypt'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'user',
      queryType: 'findUnique',
      includes: ['permissions'],
      filter: { id: Number(id) }
    }

    const user = await query({ ...params })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const { names, paternalSurname, maternalSurname, email, password, enrollmentId, groups, currentGroup, nextGroup, type, shift, permissions, club } = await request.json()

  if (!names || !paternalSurname || !maternalSurname || !email || !password || !enrollmentId || !groups || !currentGroup || !nextGroup || !type || !shift ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  try{
    const hashedPassword = await bcrypt.hash(password, 12)

    const relations = club ? ([{
      entity: 'permissions', 
      data: permissions
    },
    {
      entity: 'club',
      data: club
    }]) : [{
      entity: 'permissions',
      data: permissions
    }]

    const params = {
      entity: 'user',
      queryType: 'update',
      includes: ['permissions'],
      filter: { id: Number(id) },
      data: {
        names, 
        paternalSurname, 
        maternalSurname, 
        email, 
        password: hashedPassword, 
        enrollmentId, 
        groups, 
        currentGroup, 
        nextGroup, 
        type, 
        shift
      },
      relations
    }

    const user = await query({ ...params })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const { club, permissions, ...partialUpdate } = await request.json()

  const relations = club ? ([{
    entity: 'permissions', 
    data: permissions
  },
  {
    entity: 'club',
    data: club
  }]) : [{
    entity: 'permissions',
    data: permissions
  }]

  try {
    const params = {
      entity: 'user',
      queryType: 'update',
      includes: ['permissions'],
      filter: { id: Number(id) },
      data: { ...partialUpdate },
      relations
    }

    const user = await query({ ...params })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error updating user partially:', error)
    return NextResponse.json({ error: 'Error updating user partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'user',
      queryType: 'delete',
      includes: ['permissions'],
      filter: { id: Number(id) }
    }

    const user = await query({ ...params })

    
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
  }
}