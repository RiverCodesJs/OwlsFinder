import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getPackages } from '~/libs/gets'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, subjects } = await request.json()

    const newPackage = await db.package.create({
      data: {
        name,
        description,
        images,
        videos,
        limit,
        subjects:{
          connectOrCreate: subjects.map( subject => ({
            where: { id: subject.id },
            create:{
              name: subject.name,
              description: subject.description
            }
          }))
        }
      }
    })

    return NextResponse.json({ message: 'Package created successfully', newPackage }, { status: 201 })
  } catch (error) {
    console.error('Package creation failed:', error)
    return NextResponse.json({ error: 'Package creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const packages = await getPackages()

    return NextResponse.json({ packages }, { status: 200 })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Error fetching packages' }, { status: 500 })
  }
}