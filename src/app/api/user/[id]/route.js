import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getUser } from '~/libs/gets'

export const GET = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const user = await getUser(id)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  const packageUser = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const user = await db.user.find({
      where:{ id: Number(id) },
      data:{ ...packageUser }
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params

  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    await db.user.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting user successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
  }
}