import { NextResponse } from 'next/server'
import { Login } from '~/app/api/entities'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import queryDB from '~/app/api/libs/queryDB'
import ERROR from '~/error'
import validatorFields from '~/app/api/libs/validatorFields'

export const POST = async request => {
  try {
    const data = await request.json()
    if (validatorFields({ data, shape: Login.shape })) {
      const user = await queryDB({
        entity: 'user',
        queryType: 'findUnique',
        filter: { email: data.email },
        password: true
      })
      if(!user) return ERROR.INVALID_FIELDS()
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
