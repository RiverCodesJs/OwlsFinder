import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'


export const GET = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const permissions = await db.permision.find({
      where:{ id: Number(id) },
      include:{ user: false }
    })

    return NextResponse.json({ permissions }, { status: 200 })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Error fetching permissions' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  const permisionData = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const permissions = await db.permision.find({
      where:{ id: Number(id) },
      data:{ ...permisionData }
    })

    return NextResponse.json({ permissions }, { status: 200 })
  } catch (error) {
    console.error('Error updating permissions:', error)
    return NextResponse.json({ error: 'Error updating permissions' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params

  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    await db.permissions.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Permission deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting permissions:', error)
    return NextResponse.json({ error: 'Error deleting permissions' }, { status: 500 })
  }
}