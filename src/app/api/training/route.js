import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getTraining } from '~/libs/gets'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, schedule, professorId, professor } = await request.json()

    const newTraining = await db.training.create({
      data:{
        name,
        description,
        images,
        videos,
        limit,
        schedule,
        professor:{
          connectOrCreate:{
            where:{
              id: Number(professorId)
            },
            create:{
              ...professor
            }
          }
        }
      }
    })
    

    return NextResponse.json({ message: 'Training created successfully', newTraining }, { status: 201 })
  } catch (error) {
    console.error('Training creation failed:', error)
    return NextResponse.json({ error: 'Training creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const clubs = await getTraining()

    return NextResponse.json({ clubs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}