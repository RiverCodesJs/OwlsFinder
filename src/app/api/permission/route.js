import { NextResponse } from 'next/server'
import db from '~/libs/db'

export const POST = async request => {
  try {
    const { name } = await request.json()

    const newPermission = await db.permission.create({
      data: { name }
    })

    return NextResponse.json( newPermission, { status: 201 })
  } catch (error) {
    console.error('Permission creation failed:', error)
    return NextResponse.json({ error: 'Permission creation failed' }, { status: 500 })
  }
}

export const GET = async () => {

  try{
    const permissions = await db.permission.findMany()

    return NextResponse.json({ permissions }, { status: 200 })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Error fetching permissions' }, { status: 500 })
  }
}
