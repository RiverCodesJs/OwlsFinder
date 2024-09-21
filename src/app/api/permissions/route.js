import { NextResponse } from 'next/server'
import db from '~/libs/db'
import { authenticateToken } from '~/libs/auth'

export const POST = async request => {
  try {
    const { name } = await request.json()

    const newPermission = await db.permissions.create({
      data: { name }
    })

    return NextResponse.json({ message: 'Permission created successfully', permission: newPermission }, { status: 201 })
  } catch (error) {
    console.error('Permission creation failed:', error)
    return NextResponse.json({ error: 'Permission creation failed' }, { status: 500 })
  }
}

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const permissions = await db.permision.findMany({
      include:{
        user: false
      }
    })

    return NextResponse.json({ permissions }, { status: 200 })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Error fetching permissions' }, { status: 500 })
  }
}
