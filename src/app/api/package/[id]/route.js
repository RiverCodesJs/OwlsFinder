import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const packageFound = await db.package.findUnique({
      where: { id: Number(id) },
    })

    const pack = filter(packageFound)

    return NextResponse.json( pack, { status: 200 })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Error fetching package' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const packageData = await request.json()
  
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
  const { id } = params
  const partialUpdate = await request.json()

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
  const { id } = params

  try {
    await db.package.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting package successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Error deleting package' }, { status: 500 })
  }
}