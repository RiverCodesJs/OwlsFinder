import { NextResponse } from 'next/server'
import db from '~/libs/db'
import filter from '~/libs/filter'

export const POST = async request => {
  try {
    const { name, description, images, videos, limit, shift, schedule, professor } = await request.json()

    const newTraining = await db.training.create({
      data:{
        name,
        description,
        images,
        videos,
        limit,
        shift,
        schedule,
        professor
      }
    })
    

    return NextResponse.json({ message: 'Training created successfully', newTraining }, { status: 201 })
  } catch (error) {
    console.error('Training creation failed:', error)
    return NextResponse.json({ error: 'Training creation failed' }, { status: 500 })
  }
}

export const GET = async () => {
  try{
    const trainingsFound = await db.training.findMany()

    const trainings = trainingsFound.map(training => filter(training))

    return NextResponse.json(trainings, { status: 200 })
  } catch (error) {
    console.error('Error fetching trainings:', error)
    return NextResponse.json({ error: 'Error fetching trainings' }, { status: 500 })
  }
}