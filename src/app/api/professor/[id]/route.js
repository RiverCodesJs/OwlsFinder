import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getProfessor } from '~/libs/gets'

export const GET = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const professor = await getProfessor(id)

    return NextResponse.json({ professor }, { status: 200 })
  } catch (error) {
    console.error('Error fetching professor:', error)
    return NextResponse.json({ error: 'Error fetching professor' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  const professorData = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const professor = await db.professor.find({
      where:{ id: Number(id) },
      data:{ ...professorData }
    })

    return NextResponse.json({ professor }, { status: 200 })
  } catch (error) {
    console.error('Error updating professor:', error)
    return NextResponse.json({ error: 'Error updating professor' }, { status: 500 })
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
    const professor = await db.professor.update({
      where: { id: Number(id) },
      data: { ...partialUpdate }
    })

    return NextResponse.json({ professor }, { status: 200 })
  } catch (error) {
    console.error('Error updating professor partially:', error)
    return NextResponse.json({ error: 'Error updating professor partially' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params

  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    await db.professor.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting professor successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting professor:', error)
    return NextResponse.json({ error: 'Error deleting professor' }, { status: 500 })
  }
}