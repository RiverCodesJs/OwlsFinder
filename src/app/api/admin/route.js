import { NextResponse } from 'next/server'
import { authenticateToken } from '~/libs/auth'
import { getAdmins } from '~/libs/gets'

export const GET = async request => {
  const authResult = authenticateToken(request)
  
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status })
  }

  try{
    const user = await getAdmins()
    
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get admins' }, { status: 500 })
  }  

}

