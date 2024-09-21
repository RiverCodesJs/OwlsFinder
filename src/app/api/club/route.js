import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getClubs } from '~/libs/gets'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, schedule, professorId, professor } = await request.json()

    const newClub = await db.club.create({
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
    

    return NextResponse.json({ message: 'Club created successfully', newClub }, { status: 201 })
  } catch (error) {
    console.error('Club creation failed:', error)
    return NextResponse.json({ error: 'Club creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const clubs = await getClubs()

    return NextResponse.json({ clubs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}
