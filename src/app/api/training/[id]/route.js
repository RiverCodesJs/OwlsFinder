import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'

export const GET = async (request, { params }) => {
  const { id } = params

  try{
    const trainingFound = await db.training.findUnique({
      where: { id: Number(id) }
    })
    const training = filter(trainingFound)

    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error fetching training:', error)
    return NextResponse.json({ error: 'Error fetching training' }, { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params
  const trainingData = await request.json()

  try{
    const training = await db.training.find({
      where:{ id: Number(id) },
      data:{ ...trainingData }
    })

    return NextResponse.json({ training }, { status: 200 })
  } catch (error) {
    console.error('Error updating training:', error)
    return NextResponse.json({ error: 'Error updating training' }, { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { id } = params
  const partialUpdate = await request.json()

  try {
    const training = await db.training.update({
      where: { id: Number(id) },
      data: { ...partialUpdate }
    })

    return NextResponse.json(training, { status: 200 })
  } catch (error) {
    console.error('Error updating training partially:', error)
    return NextResponse.json({ error: 'Error updating training partially' }, { status: 500 })
  }
}


export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    await db.training.delete({ where: { id } }) 
    
    return NextResponse.json({ message: 'Deleting training successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting training:', error)
    return NextResponse.json({ error: 'Error deleting training' }, { status: 500 })
  }
}