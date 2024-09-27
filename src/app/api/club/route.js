import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'


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

export const GET = async () => {
  try{
    
    const clubsFound = await db.club.findMany()

    const clubs = clubsFound.map(club => filter(club))  

    return NextResponse.json({ clubs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Error fetching clubs' }, { status: 500 })
  }
}
