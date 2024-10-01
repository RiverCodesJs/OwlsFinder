import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const params = {
      entity: 'package',
      queryType: 'findUnique',
      includes: ['subjects'],
      filter: { id: Number(id) }
    }
    const pack = await query({ ...params })

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Error fetching package' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  const { name, description, images, videos, limit, subjects } = await request.json()

  if(!name || !description || !images || !videos || !limit){
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try{
    const params = {
      entity: 'package',
      queryType: 'update',
      includes: ['subjects'],
      filter: { id: Number(id) },
      data: {
        name,
        description,
        images,
        videos,
        limit,
      },
      relations:[{
        entity: 'subjects',
        data: subjects
      }]
    }
    const pack = await query({ ...params })

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Error updating package' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()
  const { subjects, ...data } = partialUpdate

  try {
    const params = {
      entity: 'package',
      queryType: 'update',
      includes: ['subjects'],
      filter: { id: Number(id) },
      data: { ...data },
      relations: [{
        entity: 'subjects',
        data: subjects
      }]

    }
    const pack = await query({ ...params })

    return NextResponse.json(pack, { status: 200 })
  } catch (error) {
    console.error('Error updating package partially:', error)
    return NextResponse.json({ error: 'Error updating package partially' }, { status: 500 })
  }
}


export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    const params = {
      entity: 'package',
      queryType: 'delete',
      includes: ['subjects'],
      filter: { id: Number(id) },
    }

    const pack = await query({ ...params })
    
    return NextResponse.json(pack, { message: 'Deleting package successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Error deleting package' }, { status: 500 })
  }
}