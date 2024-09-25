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
    const permission = await db.permision.find({
      where:{ id: Number(id) },
      include:{ user: false }
    })

    return NextResponse.json({ permission }, { status: 200 })
  } catch (error) {
    console.error('Error fetching permission:', error)
    return NextResponse.json({ error: 'Error fetching permission' }, { status: 500 })
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
    const permission = await db.permision.find({
      where:{ id: Number(id) },
      data:{ ...permisionData }
    })

    return NextResponse.json({ permission }, { status: 200 })
  } catch (error) {
    console.error('Error updating permission:', error)
    return NextResponse.json({ error: 'Error updating permission' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  const partialUpdate = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    const permission = await db.permission.update({
      where: { id: Number(id) },
      data: { ...partialUpdate }
    })

    return NextResponse.json({ permission }, { status: 200 })
  } catch (error) {
    console.error('Error updating permission partially:', error)
    return NextResponse.json({ error: 'Error updating permission partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params

  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    await db.permission.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Permission deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json({ error: 'Error deleting permission' }, { status: 500 })
  }
}