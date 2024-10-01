import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, schedule, professor } = await request.json()

    if(!name, !description, !images, !videos, !limit, !schedule, !professor){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    
    const params = {
      entity: 'club',
      queryType: 'create',
      data: {
        name, 
        description, 
        images, 
        videos, 
        limit, 
        schedule
      },
      relations: [{
        entity: 'professor',
        data: professor
      }]
    }
    
    const newClub = await query({ ...params })

    return NextResponse.json(newClub, { status: 201 })
  } catch (error) {
    console.error('Club creation failed:', error)
    return NextResponse.json({ error: 'Club creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    
    const params = {
      entity: 'club',
      queryType: 'findMany',
    } 

    const clubs = await query({ ...params })

    return NextResponse.json( clubs, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}
