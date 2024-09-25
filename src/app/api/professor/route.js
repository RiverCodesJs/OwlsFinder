import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getProfessors } from '~/libs/gets'

export const POST = async request => {
  try {
    const { name, paternalSurname, maternalSurname, email } = await request.json()

    const newProfessor = await db.professor.create({
      data:{
        name,
        paternalSurname,
        maternalSurname,
        email,
      }
    })
    
    return NextResponse.json({ message: 'Professor created successfully', newProfessor }, { status: 201 })
  } catch (error) {
    console.error('Professor creation failed:', error)
    return NextResponse.json({ error: 'Professor creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const professors = await getProfessors()

    return NextResponse.json({ professors }, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}