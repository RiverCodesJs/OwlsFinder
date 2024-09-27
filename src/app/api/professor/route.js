import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'


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

export const GET = async () => {
  try{
    const professorsFound = await db.professor.findMany()

    const professors = professorsFound.map(professor => filter(professor))

    return NextResponse.json(professors, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}