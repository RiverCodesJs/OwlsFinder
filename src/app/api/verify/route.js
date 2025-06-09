import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'

import ERROR from '~/Libs/error'
export const GET = async request => {
  try {
    const { userId } = authenticateToken(request)
    if (!userId) return ERROR.FORBIDDEN()
    return NextResponse.json({ userId }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 401 })
  }
}