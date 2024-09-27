import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'

export const GET = async (request, { params }) => {
  const { id } = params  

  try{
    const clubFound = await db.club.findUnique({
      where: { id: Number(id) }
    })

    const club = filter(clubFound)

    return NextResponse.json(club, { status: 200 })
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json({ error: 'Error fetching club' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const clubData = await request.json()
  
  try{
    const club = await db.club.find({
      where:{ id: Number(id) },
      data:{ ...clubData }
    })

    return NextResponse.json({ club }, { status: 200 })
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json({ error: 'Error updating club', message: error }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    await db.club.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting club successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json({ error: 'Error deleting club' }, { status: 500 })
  }
}