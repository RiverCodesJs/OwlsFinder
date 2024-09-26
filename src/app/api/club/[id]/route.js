import { NextResponse } from 'next/server'
import db from '~/libs/db'
//import { authenticateToken } from '~/libs/auth'
import { getClub } from '~/libs/gets'


export const GET = async (request, { params }) => {
  const { id } = params

  //TODO add after check the endpoint
  // const authResult = authenticateToken(request)
  
  // if (authResult.status !== 200) {
  //   return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  // }

  try{
    const club = await getClub(id)

    return NextResponse.json({ club }, { status: 200 })
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json({ error: 'Error fetching club' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const clubData = await request.json()
  //TODO add after check the endpoint
  // const authResult = authenticateToken(request)
  
  // if (authResult.status !== 200) {
  //   return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  // }

  try{
    const club = await db.club.find({
      where:{ id: Number(id) },
      data:{ ...clubData }
    })

    return NextResponse.json({ club }, { status: 200 })
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json({ error: 'Error updating club' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params
  //TODO add after check the endpoint
  // const authResult = authenticateToken(request)
  
  // if (authResult.status !== 200) {
  //   return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  // }

  try {
    await db.club.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting club successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json({ error: 'Error deleting club' }, { status: 500 })
  }
}