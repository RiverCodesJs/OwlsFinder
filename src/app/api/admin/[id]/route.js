import { NextResponse } from 'next/server'
import { authenticateToken } from '~/libs/auth'
import { getAdmin } from '~/libs/gets'
import db from '~/libs/db'

export const GET = async (request, { params }) => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }
  
  try{
    const { id } = params

    const user = await getAdmin(id)
  
    return NextResponse.json({ user })
  } catch (error){
    return NextResponse.json({ error: 'Failed to get admin' }, { status: 500 })
  }

 
}

export const PUT = async (request, { params }) => {

  const authResult = authenticateToken(request)
  const { id } = params
  const adminData = await request.json()
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try {
    const updatedAdmin = await db.user.update({
      where: { id: Number(id) },
      data: { ...adminData },
    })

    return NextResponse.json({ updatedAdmin })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  const { id } = params

  try {
    const deletedAdmin = await db.user.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ deletedAdmin })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}


