import { NextResponse } from 'next/server'
import query from '~/app/api/libs/query'
import { packageShape } from '~/app/api/utils/shapes'

export const POST = async request => {
  try {
    const data = await request.json()
    
    if (!packageShape().every(key => key in data)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
   
    for (let i = 1; i <= 3; i++) {
      const subjectKey = `subject${i}`
      if (!data[subjectKey].id) {
        const subjectParams = {
          entity: 'subject',
          queryType: 'create',
          data: { ...data[subjectKey] }
        }

        const newSubject = await query(subjectParams)
        data[subjectKey] = newSubject.id 

      }else{
        data[subjectKey] = data[subjectKey].id 
      }
    }

    const params = {
      entity: 'package',
      queryType: 'create',
      data
    }
    
    const newPackage = await query(params)

    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Package creation failed:', error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    const params = {
      entity: 'package',
      queryType: 'findMany',
    }

    const packages = await query(params)

    return NextResponse.json(packages, { status: 200 })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}