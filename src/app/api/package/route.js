import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, subjects } = await request.json()

    if(!name || !description || !images || !videos || !limit || !subjects){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const params = {
      entity: 'package',
      queryType: 'create',
      includes: ['subjects'],
      data: {
        name,
        description,
        images,
        videos,
        limit,
      },
      relations: [{
        entity: 'subjects',
        data: subjects
      }]
    }


    const newPackage = await query({ ...params })

    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Package creation failed:', error)
    return NextResponse.json({ error: 'Package creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{

    const params = {
      entity: 'package',
      queryType: 'findMany',
      includes: ['subjects']
    }

    const packages = await query({ ...params })

    return NextResponse.json(packages, { status: 200 })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Error fetching packages' }, { status: 500 })
  }
}