import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'

import ERROR from '~/error'

export const GET = async request => {
  try {
    const { userId, type } = authenticateToken(request)
    if (!userId || !type) return ERROR.FORBIDDEN()
    return NextResponse.json({ userId, type }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 401 })
  }
}