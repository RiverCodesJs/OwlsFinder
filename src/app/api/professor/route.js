import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name, paternalSurname, maternalSurname, email, club } = await request.json()
   
    if(!name || !paternalSurname || !maternalSurname || !email){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const relations = club ? ([{
      entity: 'clubs',
      data: club 
    }]) : undefined

    const params = {
      entity: 'professor',
      queryType: 'create',
      includes: ['clubs'],
      data: {
        name,
        paternalSurname, 
        maternalSurname, 
        email
      },
      relations
    }

    const newProfessor = await query({ ...params })
    
    return NextResponse.json(newProfessor, { status: 201 })
  } catch (error) {
    console.error('Professor creation failed:', error)
    return NextResponse.json({ error: 'Professor creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    const params = {
      entity: 'professor',
      queryType: 'findMany',
      includes: ['clubs'],
    }

    const professors = await query({ ...params })

    return NextResponse.json(professors, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}