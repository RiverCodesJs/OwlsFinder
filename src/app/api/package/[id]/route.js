import { NextResponse } from 'next/server'
import query from '~/app/api/libs/query'
import { packageShape } from '~/app/api/utils/shapes'
import { equals } from 'ramda'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'package',
      queryType: 'findUnique',
      filter: { id: Number(id) }
    }
    const pack = await query(params)

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const data = await request.json()

  try{
    if (!packageShape().every(key => key in data)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    for (let i = 1; i <= 3; i++) {
      const subjectKey = `subject${i}`

      if (!data[subjectKey].id) {
        const subjectParams = {
          entity: 'subject',
          queryType: 'create',
          data: data[subjectKey] 
        }
        
        const newSubject = await query(subjectParams)
        data[subjectKey] = newSubject.id 

      }else{
        const subjectParams = {
          entity: 'subject',
          queryType: 'findUnique',
          filter: { id: data[subjectKey].id },
        }

        const currentSubject = await query(subjectParams)

        if(!equals(currentSubject, data[subjectKey])){
          const updateParams = {
            entity: 'subject',
            queryType: 'update',
            filter: { id: data[subjectKey].id },
            data: data[subjectKey]
          }
          await query(updateParams)
        }

        data[subjectKey] = data[subjectKey].id 
      }
    }

    const params = {
      entity: 'package',
      queryType: 'update',
      filter: { id: Number(id) },
      data
    }
    const pack = await query(params)

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const data = await request.json()

  try {
    for (let i = 1; i <= 3; i++) {
      const subjectKey = `subject${i}`

      if (data[subjectKey] && !data[subjectKey].id) {
        const subjectParams = {
          entity: 'subject',
          queryType: 'create',
          data: data[subjectKey] 
        }
        
        const newSubject = await query(subjectParams)
        data[subjectKey] = newSubject.id 

      }else if(data[subjectKey]){
        const subjectParams = {
          entity: 'subject',
          queryType: 'findUnique',
          filter: { id: data[subjectKey].id },
        }

        const currentSubject = await query(subjectParams)

        if(!equals(currentSubject, data[subjectKey])){
          const updateParams = {
            entity: 'subject',
            queryType: 'update',
            filter: { id: data[subjectKey].id },
            data: data[subjectKey]
          }
          await query(updateParams)
        }

        data[subjectKey] = data[subjectKey].id 
      }
    }

    const params = {
      entity: 'package',
      queryType: 'update',
      filter: { id: Number(id) },
      data,
    }

    const pack = await query(params)

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error updating package partially:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export const DELETE = async ({ params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'package',
      queryType: 'delete',
      filter: { id: Number(id) },
    }

    const pack = await query(params)
    
    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}