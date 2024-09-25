import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import db from '~/libs/db'

export const POST = async req => {
  try{
    const { username, password, permissions } = await req.json()

    if (!username || !password || !permissions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const adminFound = await db.admin.findUnique({
      where: { username },
    })

    if (adminFound) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 400 }
      )
    }

    const newAdmin = await db.admin.create({
      data: {
        username,
        password: hashedPassword,
        permissions: {
          create: permissions.map(permissionId => ({
            permission: {
              connect: { id: permissionId }
            }
          }))
        }
      },
      include: {
        permissions: true
      }
    })

    return NextResponse.json(
      { message: 'Admin registered successfully', admin: newAdmin },
      { status: 201 })

  }catch (error){
    console.error('User registration failed:', error)
    return NextResponse.json(
      { error: 'User registration failed', details: error.message },
      { status: 500 })
  }
}