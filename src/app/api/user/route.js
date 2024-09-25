import { NextResponse } from 'next/server'
import db from '~/libs/db'
import bcrypt from "bcrypt";
import { authenticateToken } from '~/libs/auth'

export const POST = async request => {
  try {
    const { names, paternalSurname, maternalSurname, email, password, enrollmentId, groups, beforeGroup, nextGroup, isAdmin, isCounselor, isStudent, shift, permisions } = await request.json()



    const newPackage = await db.package.create({
      data: {
        names,
        paternalSurname,
        maternalSurname,
        email,

        }
      }
    })

    return NextResponse.json({ message: 'Package created successfully', newPackage }, { status: 201 })
  } catch (error) {
    console.error('Package creation failed:', error)
    return NextResponse.json({ error: 'Package creation failed' }, { status: 500 })
  }
}