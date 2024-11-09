import { NextResponse } from 'next/server'
import { loginShape } from '~/app/api/utils/shapes'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import query from '~/app/api/libs/query'
import ERROR from '~/error'
import validatorFields from '~/app/api/libs/validatorFields'

export const POST = async request => {
  try {
    const data = await request.json()
    if (validatorFields({ data, shape: loginShape })) {
      const user = await query({
        entity: 'user',
        queryType: 'findUnique',
        filter: { email: data.email },
        password: true
      })
      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if(isPasswordValid){
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
        return NextResponse.json(token, { status: 200 })
      }
    }
    return ERROR.INVALID_FIELDS()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
