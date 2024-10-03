import { NextResponse } from 'next/server'
import query from '~/libs/query'
import bcrypt from 'bcrypt'

export const POST = async request => {
  try {
    const { names, paternalSurname, maternalSurname, email, password, enrollmentId, groups, currentGroup, nextGroup, type, shift, permissions, club } = await request.json()

    if (!names || !paternalSurname || !maternalSurname || !email || !password || !enrollmentId || !groups || !currentGroup || !nextGroup || !type || !shift || !permissions) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

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

    const hashedPassword = await bcrypt.hash(password, 12)

    const params = {
      entity: 'user',
      queryType: 'create',
      includes: ['permissions'],
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

    const newUser = await query({ ...params })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('User creation failed:', error)
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    const params = {
      entity: 'user',
      queryType: 'findMany',
      includes: ['permissions'],
    }

    const users = await query({ ...params })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}