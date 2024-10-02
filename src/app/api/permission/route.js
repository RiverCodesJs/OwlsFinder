import { NextResponse } from 'next/server'
import query from '~/libs/query'

export const POST = async request => {
  try {
    const { name } = await request.json()

    if(!name){
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 }) 
    }

    const params = {
      entity: 'permission',
      queryType: 'create',
      data: {
        name
      }
    }

    const newPermission = await query({ ...params })


    return NextResponse.json( newPermission, { status: 201 })
  } catch (error) {
    console.error('Permission creation failed:', error)
    return NextResponse.json({ error: 'Permission creation failed' }, { status: 500 })
  }
}

export const GET = async () => {

  try{
    const params = {
      entity: 'permission',
      queryType: 'findMany',
    }

    const permissions = await query({ ...params })

    return NextResponse.json(permissions, { status: 200 })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Error fetching permissions' }, { status: 500 })
  }
}
