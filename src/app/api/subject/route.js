import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name, description } = await request.json()

    if(!name || !description ){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const params = {
      entity: 'subject',
      queryType: 'create',
      data: {
        name,
        description
      },
    }


    const newSubject = await query({ ...params })

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    console.error('Subject creation failed:', error)
    return NextResponse.json({ error: 'Subject creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{

    const params = {
      entity: 'subject',
      queryType: 'findMany',
    }

    const subjects = await query({ ...params })

    return NextResponse.json(subjects, { status: 200 })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
  }
}