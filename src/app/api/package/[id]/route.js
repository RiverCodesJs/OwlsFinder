import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'
import { getPackage } from '~/libs/gets'

export const GET = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const pack = await getPackage(id)

    return NextResponse.json({ pack }, { status: 200 })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Error fetching package' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params
  const packageData = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const pack = await db.package.find({
      where:{ id: Number(id) },
      data:{ ...packageData }
    })

    return NextResponse.json({ pack }, { status: 200 })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Error updating package' }, { status: 500 })
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
    const pack = await db.package.update({
      where: { id: Number(id) },
      data: { ...partialUpdate }
    })

    return NextResponse.json({ pack }, { status: 200 })
  } catch (error) {
    console.error('Error updating package partially:', error)
    return NextResponse.json({ error: 'Error updating package partially' }, { status: 500 })
  }
}


export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  const { id } = params

  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    await db.package.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting package successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Error deleting package' }, { status: 500 })
  }
}