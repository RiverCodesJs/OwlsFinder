import { NextResponse } from 'next/server'
import query from '~/app/api/libs/query'
import { subjectShape } from '~/app/api/utils/shapes'

export const POST = async request => {
  try {
    const data = await request.json()

    if (!subjectShape().every(key => key in data)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const params = {
      entity: 'subject',
      queryType: 'create',
      data
    }

    const newSubject = await query(params)

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    console.error('Subject creation failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = async () => {
  try{

    const params = {
      entity: 'subject',
      queryType: 'findMany',
    }

    const subjects = await query(params)

    return NextResponse.json(subjects, { status: 200 })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}