import { NextResponse } from 'next/server'
import db from '~/libs/db'
import bcrypt from 'bcrypt'
import { authenticateToken } from '~/libs/auth'
import { getUsers } from '~/libs/gets'

export const POST = async request => {
  try {
    const { names, paternalSurname, maternalSurname, email, password, enrollmentId, groups, currentGroup, nextGroup, isAdmin, isCounselor, isStudent, shift, permisions } = await request.json()

    const hashedPassword = await bcrypt.hash(password, 21)

    const newUser = await db.user.create({
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
        isAdmin,
        isCounselor,
        isStudent,
        shift,
        permisions: {
          connect: permisions.map( permision => ({ id: Number(permision.id) }))
        }
      }
    })

    return NextResponse.json({ message: 'User created successfully', newUser }, { status: 201 })
  } catch (error) {
    console.error('User creation failed:', error)
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const users = await getUsers()

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}